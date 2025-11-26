import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EssayConfig, GradingResult } from "../types";
import { MOCK_RUBRIC_TEXT, getMaxScore } from "../constants";

const getSystemInstruction = () => {
  return MOCK_RUBRIC_TEXT;
};

// Define the response schema strictly
const gradingSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    ocrText: { type: Type.STRING, description: "识别出的作文文本 (如果是图片输入) 及 题目关键信息。" },
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
  essayInput: string | File, 
  questionInput: string | File,
  config: EssayConfig
): Promise<GradingResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key缺失。请检查您是否在Vercel环境变量中正确设置了 yyz_API_KEY。");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const maxScore = getMaxScore(config.examType, config.essayType);

  // Construct Prompt based on input types
  let questionPromptPart = "";
  let essayPromptPart = "";
  const parts: any[] = [];

  // Handle Question Input
  if (typeof questionInput === 'string') {
    questionPromptPart = `题目要求 (Question/Prompt):\n"${questionInput}"`;
  } else {
    // Image Question
    const qBase64 = await fileToGenerativePart(questionInput);
    parts.push({ inlineData: { mimeType: questionInput.type, data: qBase64 } });
    questionPromptPart = `题目要求见附图 [IMAGE_1]。请识别图片中的文字说明及图表数据作为题目要求。`;
  }

  // Handle Essay Input
  if (typeof essayInput === 'string') {
    essayPromptPart = `学生的作文内容:\n"${essayInput}"`;
  } else {
    // Image Essay
    const eBase64 = await fileToGenerativePart(essayInput);
    parts.push({ inlineData: { mimeType: essayInput.type, data: eBase64 } });
    
    // Determine how to refer to this image (Image 1 or Image 2)
    const imageIndex = typeof questionInput !== 'string' ? "[IMAGE_2]" : "[IMAGE_1]";
    essayPromptPart = `学生的作文见附图 ${imageIndex}。请先进行OCR识别，然后对识别出的文本进行评分。`;
  }

  const taskPrompt = `
    你正在批改考研英语作文: ${config.examType} - ${config.essayType}.
    该部分满分为 ${maxScore} 分。
    
    ${questionPromptPart}

    ${essayPromptPart}

    请严格按照系统指令中提供的考研英语评分细则进行分析。
    1. 确定档次 (第一档 到 第五档)。
    2. 给出具体的得分 (满分 ${maxScore})。
    3. 提供内容、语法、连贯性、格式四个维度的评分 (归一化为0-100分，用于图表展示)。
    4. 提供**中文**的整体评语 (generalComment)。
    5. 提供详细的分项点评 (criterion, comment)，**必须使用中文**。
    6. 提供修改后的英语文章 (correctedText)，修正语法和词汇错误。
    7. 提供3-5条具体的**中文**改进建议 (improvementSuggestions)。
  `;

  // Add the text prompt as the last part
  parts.push({ text: taskPrompt });

  try {
    const modelName = 'gemini-2.5-flash'; 
    
    const response = await ai.models.generateContent({
      model: modelName,
      config: {
        systemInstruction: getSystemInstruction(),
        responseMimeType: "application/json",
        responseSchema: gradingSchema,
        temperature: 0.4, 
      },
      contents: [{ role: 'user', parts: parts }] as any 
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
    if (error instanceof Error && (error.message.includes("API key not valid") || error.message.includes("API_KEY_INVALID"))) {
      throw new Error(
        "API密钥无效。您提供的密钥无法通过Google的验证。请确认您在Vercel环境变量中设置的 `yyz_API_KEY` 是一个有效的 Google Gemini API 密钥。它通常不是以 'sk-' 开头的。请前往 Google AI Studio (makersuite.google.com) 获取正确的密钥。"
      );
    }
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