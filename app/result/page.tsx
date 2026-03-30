"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, FileText, Sparkles, Loader2, Save, UserPlus } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { getAnalysisResult } from "@/lib/actions/analyze"

function ResultContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [data, setData] = useState<{
    score: number
    missingKeywords: string[]
    suggestions: string[]
    resumeFileName: string
    jobDescription: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const analysisId = searchParams.get("id")
  const encodedData = searchParams.get("data")

  const [isAuthenticated, setIsAuthenticated] = useState(true)

  useEffect(() => {
    // Unauth user: decode data from URL
    if (encodedData) {
      setIsAuthenticated(false)
      try {
        const decodedData = JSON.parse(decodeURIComponent(encodedData))
        setData(decodedData)
        setLoading(false)
        return
      } catch {
        setError("Failed to decode analysis data")
        setLoading(false)
        return
      }
    }

    // Auth user: fetch from DB using analysisId
    if (!analysisId) {
      router.push("/")
      return
    }

    async function fetchAnalysis() {
      const result = await getAnalysisResult(analysisId!)

      if (result.success === false) {
        setError(result.error)
        setLoading(false)
        return
      }

      setData(result.data)
      setLoading(false)
    }

    fetchAnalysis()
  }, [analysisId, encodedData, router])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 60) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return "Great match! Your resume aligns well with this job."
    if (score >= 60) return "Moderate match. Some improvements needed."
    return "Low match. Significant changes recommended."
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="h-8 w-8 text-green-500" />
    if (score >= 60) return <AlertCircle className="h-8 w-8 text-yellow-500" />
    return <XCircle className="h-8 w-8 text-red-500" />
  }

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your analysis...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="w-full min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Analysis Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || "The analysis may have expired or been deleted."}</p>
            <Button asChild>
              <Link href="/">Try Again</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="w-full min-h-screen bg-background">
      <Navbar />
      
      <section className="py-12 px-4">
        <div className="mx-auto max-w-4xl">
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Analysis
            </Link>
          </Button>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Your Resume Analysis Results
            </h1>
            <p className="text-lg text-muted-foreground">
              Here&apos;s how well your resume matches the job description
            </p>
          </div>

          {/* Score Card */}
          <Card className="p-8 mb-8">
            <div className="flex flex-col items-center">
              <div className="mb-4">
                {getScoreIcon(data.score)}
              </div>
              <div className="text-6xl font-bold mb-2">
                <span className={getScoreColor(data.score)}>{data.score}%</span>
              </div>
              <p className="text-xl text-muted-foreground mb-6">
                {getScoreMessage(data.score)}
              </p>
              <div className="w-full max-w-md">
                <Progress value={data.score} className="h-3" />
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Resume Info */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Analyzed Resume</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{data.resumeFileName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Successfully parsed and analyzed by AI
              </div>
            </Card>

            {/* Job Info */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Job Description</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {data.jobDescription}
              </p>
            </Card>
          </div>

          {/* Missing Keywords */}
          <Card className="p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Missing Keywords</h3>
            <p className="text-sm text-muted-foreground mb-4">
              These keywords were found in the job description but missing from your resume:
            </p>
            <div className="flex flex-wrap gap-2">
              {data.missingKeywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-full bg-destructive/10 text-destructive text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </Card>

          {/* Suggestions */}
          <Card className="p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Improvement Suggestions</h3>
            <ul className="space-y-3">
              {data.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" asChild>
              <Link href="/">Re-run the Magic</Link>
            </Button>
            <Button variant="outline" size="lg">
              Download Full Report
            </Button>
          </div>

          {/* Signup CTA for unauthenticated users */}
          {!isAuthenticated && (
            <Card className="p-6 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                    <Save className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Save Your Analysis</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Create an account to save this analysis and access it anytime.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your results are currently temporary and will be lost if you leave this page.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild>
                    <Link href="/auth" className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Sign Up Free
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/auth">Sign In</Link>
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>
    </main>
  )
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <main className="w-full min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </div>
      </main>
    }>
      <ResultContent />
    </Suspense>
  )
}
