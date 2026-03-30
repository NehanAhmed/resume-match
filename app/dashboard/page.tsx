"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "@/components/Navbar"
import { authClient } from "@/lib/auth-client"
import { getUserAnalyses } from "@/lib/actions/dashboard"
import { 
  User, 
  FileText, 
  LogOut, 
  Calendar, 
  Mail, 
  TrendingUp,
  ArrowRight,
  Loader2,
  Sparkles
} from "lucide-react"
import Link from "next/link"

interface Analysis {
  id: string
  resumeFileName: string
  jobDescription: string
  score: number
  missingKeywords: string[]
  suggestions: string[]
  createdAt: Date
  expiresAt: Date
}

interface UserData {
  id: string
  name: string
  email: string
  emailVerified: boolean
  createdAt: Date
  image?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserData | null>(null)
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const session = await authClient.getSession()
      if (!session.data?.user) {
        router.push("/auth")
        return
      }

      setUser(session.data.user as UserData)
      
      const result = await getUserAnalyses()
      if (result.success) {
        setAnalyses(result.analyses)
      }
      
      setLoading(false)
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    await authClient.signOut()
    router.push("/")
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500/10 text-green-500 border-green-500/20"
    if (score >= 60) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    return "bg-red-500/10 text-red-500 border-red-500/20"
  }

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </main>
    )
  }

  if (!user) return null

  return (
    <main className="w-full min-h-screen bg-background">
      <Navbar />
      
      <section className="py-12 px-4">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your profile and view your saved analyses
            </p>
          </div>

          <Tabs defaultValue="analysis" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="analysis" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Analysis
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
              </TabsList>

              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-4">
              {analyses.length === 0 ? (
                <Card className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Sparkles className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">No analyses yet</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload your resume and get your first AI-powered analysis
                      </p>
                    </div>
                    <Button asChild>
                      <Link href="/" className="flex items-center gap-2">
                        Analyze Resume
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {analyses.map((analysis) => (
                    <Card key={analysis.id} className="group hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText className="h-5 w-5 text-primary shrink-0" />
                              <h3 className="font-semibold truncate">{analysis.resumeFileName}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {analysis.jobDescription}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(analysis.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <Badge 
                              variant="outline" 
                              className={`text-lg font-bold px-3 py-1 ${getScoreColor(analysis.score)}`}
                            >
                              {analysis.score}%
                            </Badge>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/result?id=${analysis.id}`}>
                                View
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Your account details and membership information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{user.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Mail className="h-4 w-4" />
                        {user.email}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                      <p className="text-sm font-medium">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Email Status</p>
                      <Badge variant={user.emailVerified ? "default" : "secondary"}>
                        {user.emailVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Total Analyses</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        {analyses.length} saved
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  )
}