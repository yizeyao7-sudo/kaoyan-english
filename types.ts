export enum ExamType {
  ENGLISH_I = 'English I (英语一)',
  ENGLISH_II = 'English II (英语二)'
}

export enum EssayType {
  PART_A = 'Part A (小作文)',
  PART_B = 'Part B (大作文)'
}

export interface ScoreBreakdown {
  content: number;
  grammar: number;
  coherence: number;
  format: number;
}

export interface DetailedFeedback {
  criterion: string;
  score: number;
  comment: string;
}

export interface GradingResult {
  totalScore: number;
  maxScore: number;
  band: string; // e.g., "First Tier (第五档)"
  breakdown: ScoreBreakdown;
  generalComment: string;
  detailedFeedback: DetailedFeedback[];
  correctedText: string;
  improvementSuggestions: string[];
  ocrText?: string; // If image was used
}

export interface EssayConfig {
  examType: ExamType;
  essayType: EssayType;
  question: string;
}