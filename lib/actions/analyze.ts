"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { openrouter } from "@/lib/openrouter";
import { analysisResults } from "@/src/schema";
import { nanoid } from "@/lib/utils";
import { auth } from "@/lib/auth";
import PDFParser from "pdf2json";
import type { AnalyzeResumeInput, AnalyzeResumeOutput, AIAnalysisResponse } from "./types";

// Maximum file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Analysis results expire after 24 hours
const EXPIRY_HOURS = 24;

// Extract text from PDF using pdf2json
async function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on("pdfParser_dataError", (errData: { parserError: Error }) => {
      reject(new Error("Failed to parse PDF: " + errData.parserError.message));
    });
    
    pdfParser.on("pdfParser_dataReady", (pdfData: { Pages: Array<{ Texts: Array<{ R: Array<{ T: string }> }> }> }) => {
      // Extract text from all pages - text is in Pages[].Texts[].R[].T (URI encoded)
      let fullText = "";
      
      if (pdfData.Pages) {
        for (const page of pdfData.Pages) {
          if (page.Texts) {
            for (const textBlock of page.Texts) {
              if (textBlock.R) {
                for (const run of textBlock.R) {
                  if (run.T) {
                    // Decode URI encoded text
                    try {
                      fullText += decodeURIComponent(run.T) + " ";
                    } catch {
                      fullText += run.T + " ";
                    }
                  }
                }
              }
            }
            fullText += "\n";
          }
        }
      }
      
      resolve(fullText.trim());
    });
    
    pdfParser.parseBuffer(buffer);
  });
}

/**
 * Call OpenRouter AI to analyze resume against job description
 * 
 * TODO: Paste your prompt here
 */
async function analyzeWithAI(
  resumeText: string,
  jobDescription: string
): Promise<AIAnalysisResponse> {
  // Truncate inputs to manage token usage
  const truncatedResume = resumeText.slice(0, 8000);
  const truncatedJob = jobDescription.slice(0, 4000);

  const prompt = `
You are an expert ATS analyst and technical recruiter. Analyze the resume against the job description with critical, evidence-based judgment — not surface-level matching.
Evaluate: keyword/skills alignment, experience relevance, measurable impact, ATS compatibility, and seniority fit. Your score must be honest and defensible — 80+ means strong match, below 50 means significant gaps.
Return only valid JSON. No explanation, no markdown, no preamble:
json{
  "score": <0-100>,
  "missingKeywords": ["exact terms from JD missing in resume"],
  "suggestions": ["specific, actionable tips referencing both documents"]
}
Think step by step before scoring.
Resume:
${truncatedResume}

Job Description:
${truncatedJob}

Return JSON in this exact format:
{
  "score": 0-100,
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": ["suggestion1", "suggestion2"]
}
`;

  try {
    const response = await openrouter.chat.completions.create({
      model: "anthropic/claude-3.5-sonnet",
      messages: [
        {
          role: "system",
          content: "You are a professional resume analyzer. Provide accurate, helpful analysis. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from AI");
    }

    // Extract JSON from response (handles markdown code blocks)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const parsed = JSON.parse(jsonMatch[0]) as AIAnalysisResponse;

    // Validate response structure
    if (
      typeof parsed.score !== "number" ||
      !Array.isArray(parsed.missingKeywords) ||
      !Array.isArray(parsed.suggestions)
    ) {
      throw new Error("Invalid AI response structure");
    }

    // Normalize score to 0-100 range
    parsed.score = Math.max(0, Math.min(100, Math.round(parsed.score)));

    return parsed;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse AI response");
    }
    throw error;
  }
}

/**
 * Server action to analyze a resume against a job description
 * - Auth users: results saved to DB with userId
 * - Unauth users: results returned directly without DB storage
 */
export async function analyzeResume(
  input: AnalyzeResumeInput
): Promise<AnalyzeResumeOutput> {
  try {
    // Debug logging
    console.log("Received file:", {
      hasFile: !!input.resumeFile,
      type: input.resumeFile?.type,
      size: input.resumeFile?.size,
      name: input.resumeFile?.name,
      isFileInstance: input.resumeFile instanceof File,
    });

    // Validate inputs
    if (!input.resumeFile) {
      return { success: false, error: "Resume file is required" };
    }

    // Check if it's a valid File-like object (may not be instanceof File in server context)
    if (typeof input.resumeFile.arrayBuffer !== "function") {
      return { success: false, error: "Invalid file upload. Please try again." };
    }

    if (!input.jobDescription?.trim()) {
      return { success: false, error: "Job description is required" };
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    
    if (!allowedTypes.includes(input.resumeFile.type)) {
      return { 
        success: false, 
        error: "Invalid file type. Only PDF, DOC, and DOCX files are supported." 
      };
    }

    // Validate file size
    if (input.resumeFile.size > MAX_FILE_SIZE) {
      return { 
        success: false, 
        error: "File too large. Maximum size is 10MB." 
      };
    }

    // Check if user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    const isAuthenticated = !!session?.user?.id;

    // Convert file to buffer
    console.log("Converting file to buffer...", {
      fileSize: input.resumeFile.size,
      fileType: input.resumeFile.type,
    });
    
    const bytes = await input.resumeFile.arrayBuffer();
    console.log("ArrayBuffer received:", bytes.byteLength, "bytes");
    
    const buffer = Buffer.from(bytes);
    console.log("Buffer created:", buffer.length, "bytes");

    // Extract text from PDF
    const resumeText = await extractPdfText(buffer);
    console.log("PDF text extracted:", resumeText.length, "chars");

    if (!resumeText.trim()) {
      return { 
        success: false, 
        error: "Could not extract text from the resume. The file may be corrupted or scanned." 
      };
    }

    // Analyze with AI
    const aiResult = await analyzeWithAI(resumeText, input.jobDescription);

    // Prepare analysis data
    const analysisData = {
      score: aiResult.score,
      missingKeywords: aiResult.missingKeywords,
      suggestions: aiResult.suggestions,
      resumeFileName: input.resumeFile.name,
      jobDescription: input.jobDescription.trim(),
    };

    if (isAuthenticated) {
      // Auth user: Save to database with userId
      const analysisId = nanoid();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + EXPIRY_HOURS);

      await db.insert(analysisResults).values({
        id: analysisId,
        userId: session.user.id,
        resumeFileName: input.resumeFile.name,
        jobDescription: input.jobDescription.trim(),
        resumeText: resumeText.slice(0, 10000),
        score: aiResult.score,
        missingKeywords: aiResult.missingKeywords,
        suggestions: aiResult.suggestions,
        expiresAt,
      });

      revalidatePath("/result");

      return { success: true, analysisId, isAuthenticated: true };
    } else {
      // Unauth user: Return data directly without saving
      return { success: true, data: analysisData, isAuthenticated: false };
    }
  } catch (error) {
    console.error("Analysis error:", error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}

/**
 * Get analysis result by ID
 */
export async function getAnalysisResult(
  analysisId: string
): Promise<
  | { success: false; error: string }
  | {
      success: true;
      analysisId: string;
      data: {
        score: number;
        missingKeywords: string[];
        suggestions: string[];
        resumeFileName: string;
        jobDescription: string;
      };
    }
> {
  try {
    if (!analysisId) {
      return { success: false, error: "Analysis ID is required" };
    }

    const result = await db.query.analysisResults.findFirst({
      where: (table, ops) => ops.eq(table.id, analysisId),
    });

    if (!result) {
      return { success: false, error: "Analysis not found or has expired" };
    }

    // Check if expired
    if (new Date() > result.expiresAt) {
      return { success: false, error: "Analysis has expired" };
    }

    return {
      success: true,
      analysisId,
      data: {
        score: result.score,
        missingKeywords: result.missingKeywords,
        suggestions: result.suggestions,
        resumeFileName: result.resumeFileName,
        jobDescription: result.jobDescription,
      },
    };
  } catch (error) {
    console.error("Fetch analysis error:", error);
    return { success: false, error: "Failed to fetch analysis" };
  }
}
