import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EssayConfig, GradingResult, ExamType, EssayType } from "../types";
import { MOCK_RUBRIC_TEXT, getMaxScore } from "../constants";

const getSystemInstruction = () => {
  return MOCK_RUBRIC_TEXT;
};

// Define the response schema strictly
const gradingSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    ocrText: { type: Type.STRING, description: "识别出的作文文本 (如果是图片输入)。" },
    totalScore: { type: Type.NUMBER, description: "最终得分。" },
    band: { type: Type.STRING, description: "档次 (例如 '第五档', '第四档')。" },
    breakdown: {
      type: Type.OBJECT,
      properties: {
        content: { type: Type.NUMBER, description: "内容得分 (0-100归一化)" },
        grammar: { type: Type.NUMBER, description: "语法得分 (0-100归一化)" },
        coherence: { type: Type.NUMBER, description: "连贯性得分 (0-100归一化)" },
        format: { type: Type.NUMBER, description: "格式/语域得分 (0-100归一化)" },
      },
      required: ["content", "grammar", "coherence", "format"]
    },
    generalComment: { type: Type.STRING, description: "整体中文评语。" },
    detailedFeedback: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          criterion: { type: Type.STRING, description: "评分标准 (如: 内容要点)" },
          score: { type: Type.NUMBER, description: "该项得分 (1-10)" },
          comment: { type: Type.STRING, description: "具体的中文点评" }
        }
      }
    },
    correctedText: { type: Type.STRING, description: "修改后的英语作文全文。" },
    improvementSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING, description: "具体的中文改进建议" }
    }
  },
  required: ["totalScore", "band", "breakdown", "generalComment", "detailedFeedback", "correctedText", "improvementSuggestions"]
};

export const gradeEssay = async (
  input: string | File, // Text string or Image File
  config: EssayConfig
): Promise<GradingResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key缺失。请检查您是否在Vercel环境变量中正确设置了 yyz_API_KEY。");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const maxScore = getMaxScore(config.examType, config.essayType);

  // Prompt Construction
  const taskPrompt = `
    你正在批改考研英语作文: ${config.examType} - ${config.essayType}.
    该部分满分为 ${maxScore} 分。
    
    题目要求 (Question/Prompt):
    "${config.question}"

    ${typeof input === 'string' 
      ? `学生的作文内容:\n"${input}"` 
      : `学生的作文见附图。请先进行OCR识别 (ocrText)，然后进行评分。`
    }

    请严格按照系统指令中提供的考研英语评分细则进行分析。
    1. 确定档次 (第一档 到 第五档)。
    2. 给出具体的得分 (满分 ${maxScore})。
    3. 提供内容、语法、连贯性、格式四个维度的评分 (归一化为0-100分，用于图表展示)。
    4. 提供**中文**的整体评语 (generalComment)。
    5. 提供详细的分项点评 (criterion, comment)，**必须使用中文**。
    6. 提供修改后的英语文章 (correctedText)，修正语法和词汇错误。
    7. 提供3-5条具体的**中文**改进建议 (improvementSuggestions)。
  `;

  try {
    const modelName = 'gemini-2.5-flash'; 
    
    let contents;
    if (typeof input === 'string') {
      contents = [
        { role: 'user', parts: [{ text: taskPrompt }] }
      ];
    } else {
      // It's a File object (Image)
      const base64Data = await fileToGenerativePart(input);
      contents = [
        {
          role: 'user',
          parts: [
            { inlineData: { mimeType: input.type, data: base64Data } },
            { text: taskPrompt }
          ]
        }
      ];
    }

    const response = await ai.models.generateContent({
      model: modelName,
      config: {
        systemInstruction: getSystemInstruction(),
        responseMimeType: "application/json",
        responseSchema: gradingSchema,
        temperature: 0.4, 
      },
      contents: contents as any 
    });

    const resultText = response.text;
    if (!resultText) throw new Error("No response from AI");

    const parsedResult = JSON.parse(resultText);
    
    return {
      ...parsedResult,
      maxScore: maxScore
    };

  } catch (error) {
    console.error("Grading failed:", error);
    throw error;
  }
};

async function fileToGenerativePart(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}