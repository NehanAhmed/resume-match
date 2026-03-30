"use server"

import { headers } from "next/headers"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { analysisResults } from "@/src/schema"
import { desc, eq } from "drizzle-orm"

export interface Analysis {
  id: string
  resumeFileName: string
  jobDescription: string
  score: number
  missingKeywords: string[]
  suggestions: string[]
  createdAt: Date
  expiresAt: Date
}

export async function getUserAnalyses(): Promise<
  | { success: true; analyses: Analysis[] }
  | { success: false; error: string }
> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    const results = await db
      .select({
        id: analysisResults.id,
        resumeFileName: analysisResults.resumeFileName,
        jobDescription: analysisResults.jobDescription,
        score: analysisResults.score,
        missingKeywords: analysisResults.missingKeywords,
        suggestions: analysisResults.suggestions,
        createdAt: analysisResults.createdAt,
        expiresAt: analysisResults.expiresAt,
      })
      .from(analysisResults)
      .where(eq(analysisResults.userId, session.user.id))
      .orderBy(desc(analysisResults.createdAt))

    // Filter out expired analyses
    const now = new Date()
    const validAnalyses = results.filter(
      (result) => new Date(result.expiresAt) > now
    )

    return { success: true, analyses: validAnalyses }
  } catch (error) {
    console.error("Failed to fetch user analyses:", error)
    return { success: false, error: "Failed to fetch analyses" }
  }
}

export async function deleteAnalysis(
  analysisId: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" }
    }

    await db
      .delete(analysisResults)
      .where(eq(analysisResults.id, analysisId))

    return { success: true }
  } catch (error) {
    console.error("Failed to delete analysis:", error)
    return { success: false, error: "Failed to delete analysis" }
  }
}
