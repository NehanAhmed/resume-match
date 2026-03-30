import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Resume Check",
    default: "Resume Check - AI-Powered Resume Analysis",
  },
  description: "Find out why you're not getting callbacks. AI-powered resume analysis that scores your match, finds gaps, and tells you exactly what to fix.",
  keywords: ["resume checker", "ATS scanner", "resume optimization", "AI resume analysis", "job match score"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://resumecheck.example.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Resume Check",
  },
  twitter: {
    
    card: "summary_large_image",
    site: "@resumecheck",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="max-w-full min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
