"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, FileText, Sparkles } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"

function ResultContent() {
  const searchParams = useSearchParams()
  const score = parseInt(searchParams.get("score") || "0")
  const fileName = searchParams.get("fileName") || "Unknown file"
  const jobDescription = searchParams.get("jobDescription") || ""

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

  // Generate mock missing keywords
  const missingKeywords = [
    "React Native",
    "TypeScript",
    "AWS",
    "Docker",
    "CI/CD"
  ].slice(0, Math.floor(Math.random() * 3) + 2)

  // Generate mock suggestions
  const suggestions = [
    "Add more quantifiable achievements",
    "Include relevant certifications",
    "Highlight team leadership experience",
    "Mention specific tools and technologies"
  ].slice(0, Math.floor(Math.random() * 2) + 2)

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
                {getScoreIcon(score)}
              </div>
              <div className="text-6xl font-bold mb-2">
                <span className={getScoreColor(score)}>{score}%</span>
              </div>
              <p className="text-xl text-muted-foreground mb-6">
                {getScoreMessage(score)}
              </p>
              <div className="w-full max-w-md">
                <Progress value={score} className="h-3" />
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
              <p className="text-sm text-muted-foreground mb-2">{fileName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CheckCircle className="h-3 w-3 text-green-500" />
                Successfully parsed and analyzed
              </div>
            </Card>

            {/* Job Info */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Job Description</h3>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {jobDescription || "No job description provided"}
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
              {missingKeywords.map((keyword, index) => (
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
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/">Re-run the Magic</Link>
            </Button>
            <Button variant="outline" size="lg">
              Download Full Report
            </Button>
          </div>
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
