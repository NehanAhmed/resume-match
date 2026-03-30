"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Sparkles, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { analyzeResume } from "@/lib/actions/analyze"

export function UploadSection() {
  const router = useRouter()
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const handleFileDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      const file = files[0]
      if (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setResumeFile(file)
      }
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      setResumeFile(files[0])
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      return
    }
    
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const result = await analyzeResume({
        resumeFile,
        jobDescription,
      })

      if (!result.success) {
        setError(result.error)
        setIsAnalyzing(false)
        return
      }

      if (result.isAuthenticated) {
        // Auth user: navigate with analysis ID to fetch from DB
        router.push(`/result?id=${result.analysisId}`)
      } else {
        // Unauth user: encode data in URL
        const dataParam = encodeURIComponent(JSON.stringify(result.data))
        router.push(`/result?data=${dataParam}`)
      }
    } catch (err) {
      console.error("Analysis error:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsAnalyzing(false)
    }
  }

  return (
    <section id="upload" className="py-20 bg-muted/30">
      <div className="">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to Optimize Your Resume?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your resume and paste the job description to get instant feedback on your match score.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Resume Upload Column */}
            <Card className="p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <Label htmlFor="resume-upload" className="text-base font-semibold">
                    Upload your resume
                  </Label>
                </div>
                
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
                    isDragging 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50",
                    resumeFile && "border-primary bg-primary/5"
                  )}
                  onDrop={handleFileDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  <div className="flex flex-col items-center space-y-3">
                    {resumeFile ? (
                      <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <CheckCircle className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{resumeFile.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setResumeFile(null)}>
                          Remove
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">
                            {isDragging ? "Drop your resume here" : "Click to upload or drag and drop"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, DOC, DOCX (MAX. 10MB)
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                  <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                  <span>
                    Your resume is processed securely and never stored. We support PDF, DOC, and DOCX formats.
                  </span>
                </div>
              </div>
            </Card>
            
            {/* Job Description Column */}
            <Card className="p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-50" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <Label htmlFor="job-description" className="text-base font-semibold">
                    Job Description
                  </Label>
                </div>
                
                <Textarea
                  id="job-description"
                  placeholder="Paste your Job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="min-h-50 resize-none border-border/40 focus:border-primary transition-colors"
                />
                
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {jobDescription.length} characters
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    <span>Paste the full job description for best results</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            {error && (
              <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm max-w-md mx-auto">
                {error}
              </div>
            )}
            
            <Button
              size="lg"
              onClick={handleAnalyze}
              disabled={!resumeFile || !jobDescription.trim() || isAnalyzing}
              className="group relative overflow-hidden px-8 py-3"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Run the Magic
                  </>
                )}
              </span>
              <span className="absolute inset-0 bg-linear-to-r from-primary/50 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
            
            <p className="mt-3 text-xs text-muted-foreground">
              Analysis takes 10-15 seconds. We'll compare your resume against the job requirements and provide actionable insights.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
