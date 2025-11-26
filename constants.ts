import { ExamType, EssayType } from "./types";

export const MOCK_RUBRIC_TEXT = `
你是一位严格的考研英语作文阅卷专家。请根据提供的图片或文本，对学生的作文进行评分。

**评分标准 (依据2025年考试大纲):**

**A节 (小作文):**
- 满分: 10分 (英语一 & 英语二)

**B节 (大作文):**
- 英语一满分: 20分
- 英语二满分: 15分

**分档评分细则:**

*   **第五档 (很好):**
    *   分数: A节 (9-10分), B节 (17-20分 [英一] / 13-15分 [英二]).
    *   标准: 包含并有效阐述所有内容要点；使用了丰富的语法结构和词汇；语法结构和词汇准确，错误极少；有效地使用了多种衔接手段，内容连贯、流畅，层次清晰；文体格式和语体恰当贴切。对目标读者完全产生了预期的效果。

*   **第四档 (较好):**
    *   分数: A节 (7-8分), B节 (13-16分 [英一] / 10-12分 [英二]).
    *   标准: 包含所有内容要点，少数要点未能有效阐述；使用了较丰富的语法结构和词汇；语言基本准确，只有在试图使用较复杂结构或较高级词汇时才有个别错误；比较有效地使用了些衔接手段，内容较连贯，层次较清晰；文体格式和语体较恰当。对目标读者产生了预期的效果。

*   **第三档 (基本完成):**
    *   分数: A节 (5-6分), B节 (9-12分 [英一] / 7-9分 [英二]).
    *   标准: 虽漏掉一些内容，但包含多数内容要点；语法结构和词汇基本满足任务的需求；存在一些语法结构或词汇错误，但基本不影响理解；使用了简单的衔接手段，内容基本连贯，层次基本清晰；文体格式和语体基本合理。对目标读者基本产生了预期的效果。

*   **第二档 (未能按要求完成):**
    *   分数: A节 (3-4分), B节 (5-8分 [英一] / 4-6分 [英二]).
    *   标准: 漏掉或未能有效阐述一些内容要点，写了一些无关内容；语法结构单调，词汇有限；存在较多语法结构或词汇错误，影响理解；未采用必要的衔接手段，内容缺乏连贯性；文体格式和语体不恰当。未能清楚地传达信息给读者。

*   **第一档 (未完成):**
    *   分数: A节 (1-2分), B节 (1-4分 [英一] / 1-3分 [英二]).
    *   标准: 明显遗漏主要内容，写了许多不相关的内容；语法结构很单调，词汇很有限；语言错误很多，内容很难理解；未使用任何衔接手段，内容不连贯，缺少组织、分段；无文体格式和语体概念。未能传达信息给读者。

*   **零档 (0分):**
    *   标准: 所传达的信息或所用语言太少，无法评价；内容与要求无关或无法辨认。
`;

export const getMaxScore = (examType: ExamType, essayType: EssayType): number => {
  if (essayType === EssayType.PART_A) return 10;
  if (examType === ExamType.ENGLISH_I) return 20;
  return 15;
};

// Past Exam Papers for Random Selection (2010-2025 English II)
export const PAST_PAPERS = [
  {
    year: 2025,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_A,
    content: "2025 Part A Directions:\nSuppose you are planning a short play based on a classic Chinese novel. Write your friend John an email to:\n1) introduce the play, and\n2) invite him to take part in it.\nWrite your answer in about 100 words. Do not use your own name; use 'Li Ming' instead."
  },
  {
    year: 2025,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_B,
    content: "2025 Part B Directions:\nWrite an essay based on the chart about 'Survey on Daily Leisure Activities of Elderly in a Community' (Watching TV 90.8%, Walking 68.3%, Gardening 34.7%, Reading 31.8%, Chess 18.4%).\nIn your essay, you should\n1) describe and interpret the chart, and\n2) give your comments.\nWrite your answer in about 150 words."
  },
  {
    year: 2024,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_A,
    content: "2024 Part A Directions:\nSuppose you and Jack are going to do a survey on the protection of old houses in an ancient town. Write him an email to\n1) put forward your plan, and\n2) ask for his opinion.\nWrite your answer in about 100 words. Do not use your own name; use 'Li Ming' instead."
  },
  {
    year: 2024,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_B,
    content: "2024 Part B Directions:\nWrite an essay based on the chart 'Survey on Major Gains of Students in Labor Practice Course' (Improved hands-on ability 84.8%, Learned related knowledge 91.3%, Enhanced cooperation ability 32.6%, Felt relaxed 54.4%).\nIn your essay, you should describe and interpret the chart, and give your comments.\nWrite your answer in about 150 words."
  },
  {
    year: 2023,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_A,
    content: "2023 Part A Directions:\nAn art exhibition and a robot show are to be held on Sunday, and your friend David asks you which one he should go to. Write him an email to\n1) make a suggestion, and\n2) give your reason(s).\nWrite your answer in about 100 words. Do not use your own name; use 'Li Ming' instead."
  },
  {
    year: 2023,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_B,
    content: "2023 Part B Directions:\nWrite an essay based on the chart showing 'Health Literacy Levels of Chinese Residents 2012-2021' (Rising from 8.80% in 2012 to 25.40% in 2021).\nIn your essay, you should\n1) describe and interpret the chart, and\n2) give your comments.\nWrite your answer in about 150 words."
  },
  {
    year: 2022,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_A,
    content: "2022 Part A Directions:\nSuppose you are planning a campus food festival. Write an e-mail to the international students in your university to\n1) introduce the food festival, and\n2) invite them to participate.\nWrite your answer in about 100 words."
  },
  {
    year: 2022,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_B,
    content: "2022 Part B Directions:\nWrite an essay based on the chart 'Express Delivery Volume in China 2018-2020' (Total vs Rural). \nIn your writing, you should\n1) interpret the chart, and\n2) give your comments.\nWrite your answer in about 150 words."
  },
  {
    year: 2021,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_A,
    content: "2021 Part A Directions:\nSuppose you are organizing an online meeting. Write an e-mail to Jack, an international student, to\n1) invite him to participate, and\n2) tell him the details.\nWrite your answer in about 100 words."
  },
  {
    year: 2021,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_B,
    content: "2021 Part B Directions:\nWrite an essay based on the chart 'Survey on Residents Exercise Methods' (Alone 54.3%, With friends 47.7%, With family 23.9%, Group activities 15.8%).\nIn your writing, you should\n1) interpret the chart, and\n2) give your comments.\nWrite your answer in about 150 words."
  },
  {
    year: 2020,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_A,
    content: "2020 Part A Directions:\nSuppose you are planning a tour of a historical site for a group of international students. Write them an email to\n1) tell them about the site, and\n2) give them some tips for the tour.\nWrite your answer in about 100 words."
  },
  {
    year: 2020,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_B,
    content: "2020 Part B Directions:\nWrite an essay based on the chart 'Survey on Mobile Reading Purposes of College Students' (Learning knowledge 59.5%, Killing time 21.3%, Acquiring information 17.0%, Others 2.2%).\nIn your writing, you should\n1) interpret the chart, and\n2) give your comments.\nWrite your answer in about 150 words."
  },
  {
    year: 2019,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_A,
    content: "2019 Part A Directions:\nSuppose Professor Smith asked you to plan a debate on the theme of city traffic. Write him an email to\n1) suggest a specific topic with your reasons, and\n2) tell him about your arrangements.\nWrite your answer in about 100 words."
  },
  {
    year: 2019,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_B,
    content: "2019 Part B Directions:\nWrite an essay based on the chart 'Undergraduate Graduates Destinations 2013 vs 2018' (Employment, Further Study, Entrepreneurship).\nIn your writing, you should\n1) interpret the chart, and\n2) give your comments.\nWrite your answer in about 150 words."
  },
  {
    year: 2015,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_A,
    content: "2015 Part A Directions:\nSuppose your university is going to host a summer camp for high school students. Write a notice to\n1) briefly introduce the camp activities, and\n2) call for volunteers.\nWrite your answer in about 100 words."
  },
  {
    year: 2015,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_B,
    content: "2015 Part B Directions:\nWrite an essay based on the chart 'Spring Festival Expenses of Residents in a Certain City' (New Year Gifts 40%, Transportation 20%, Dining 20%, Others 20%).\nIn your writing, you should\n1) interpret the chart, and\n2) give your comment.\nWrite your answer in about 150 words."
  },
  {
    year: 2010,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_A,
    content: "2010 Part A Directions:\nYou have just come back from the U.S. as a member of a Sino-American cultural exchange program. Write a letter to your American colleague to\n1) express your thanks for his/her warm reception;\n2) welcome him/her to visit China in due course.\nYou should write about 100 words. Do not sign your own name."
  },
  {
    year: 2010,
    examType: ExamType.ENGLISH_II,
    essayType: EssayType.PART_B,
    content: "2010 Part B Directions:\nIn this part, you are asked to write an essay based on the chart 'Mobile-phone subscriptions (2000-2008)'.\nIn your writing, you should\n1) interpret the chart and\n2) give your comments.\nYou should write at least 150 words."
  }
];
