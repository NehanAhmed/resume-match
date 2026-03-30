export interface AnalysisData {
  score: number;
  missingKeywords: string[];
  suggestions: string[];
  resumeFileName: string;
  jobDescription: string;
}

export interface AnalysisResult {
  id: string;
  resumeFileName: string;
  jobDescription: string;
  score: number;
  missingKeywords: string[];
  suggestions: string[];
  createdAt: Date;
}

export interface AnalyzeResumeInput {
  resumeFile: File;
  jobDescription: string;
}

// Auth user: returns analysisId to fetch from DB
// Unauth user: returns data directly (passed via URL)
export type AnalyzeResumeOutput = 
  | { success: true; analysisId: string; isAuthenticated: true }
  | { success: true; data: AnalysisData; isAuthenticated: false }
  | { success: false; error: string };

export interface AIAnalysisResponse {
  score: number;
  missingKeywords: string[];
  suggestions: string[];
}
