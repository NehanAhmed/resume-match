"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowRight, Sparkles, Target, Zap, Play, FileText } from "lucide-react"
import Link from "next/link"
import { Label } from "./ui/label"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="absolute inset-0 bg-linear-to-br from-background via-background to-muted/20" />
      
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/5 via-background to-background" />
      
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
        <div className="mb-6 flex justify-center">
          <div className="relative rounded-full border border-border/40 bg-muted/50 px-3 py-1 text-sm backdrop-blur-sm">
            <span className="absolute inset-0 rounded-full bg-linear-to-r from-primary/20 to-primary/5 blur-xl" />
            <span className="relative flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="font-medium">Used by 10,000+ job seekers</span>
            </span>
          </div>
        </div>
        
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
          <span className="bg-linear-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Stop Getting Ignored.
          </span>
          <br />
          <span className="bg-linear-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Start Getting Hired.
          </span>
        </h1>
        
        <p className="mb-10 text-lg leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl max-w-3xl mx-auto">
          Our AI analyzes your resume against any job description, reveals the exact keywords you are missing, and shows you precisely what to change to land the interview.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="group relative overflow-hidden" asChild>
            <Link href="#upload">
              <span className="relative z-10 flex items-center gap-2">
                Analyze My Resume Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="absolute inset-0 bg-linear-to-r from-primary/50 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="group">
                <span className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Watch Demo (2 min)
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>See How Resume Match Works</DialogTitle>
                <DialogDescription>
                  Watch how our AI analyzes resumes against job descriptions in real-time.
                </DialogDescription>
              </DialogHeader>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Play className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Demo video coming soon</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Results in 15 Seconds</h3>
            <p className="text-sm text-muted-foreground">Upload, paste, and get instant AI feedback</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Beat the ATS</h3>
            <p className="text-sm text-muted-foreground">Find hidden keywords that screeners look for</p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">Specific Fixes</h3>
            <p className="text-sm text-muted-foreground">Know exactly what to change, not generic advice</p>
          </div>
        </div>
      </div>
    </section>
  )
}
