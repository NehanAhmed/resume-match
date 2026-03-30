import type { Metadata } from "next"
import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { UploadSection } from "@/components/UploadSection"

export const metadata: Metadata = {
  title: "Resume Check - AI-Powered Resume Analysis & ATS Optimization",
  description: "Optimize your resume for ATS and land more interviews. Our AI analyzes your resume against job descriptions, finds missing keywords, and provides actionable improvement suggestions.",
  keywords: [
    "resume checker",
    "ATS resume scanner",
    "resume optimization",
    "job application tools",
    "resume keyword scanner",
    "AI resume analysis",
    "resume feedback",
    "job match score",
    "resume improvement",
    "ATS friendly resume",
  ],
  openGraph: {
    title: "Resume Check - AI-Powered Resume Analysis",
    description: "Get instant AI feedback on your resume. Match better, get hired faster.",
    type: "website",
  },
}

export default function HomePage() {
  return (
    <main className="w-full min-h-screen bg-background">
      <Navbar />
      <Hero />
      <UploadSection />
    </main>
  )
}