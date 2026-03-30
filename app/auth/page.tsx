import type { Metadata } from "next"
import AuthPageClient from "./AuthPageClient"

export const metadata: Metadata = {
  title: "Sign In | Resume Check - AI Resume Analysis",
  description: "Sign in to save your resume analyses and access them anytime. Create an account to get personalized AI-powered resume feedback.",
  keywords: ["resume sign in", "login", "create account", "resume analysis login", "job application tools"],
}

export default function AuthPage() {
  return <AuthPageClient />
}
