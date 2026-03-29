import { Navbar } from "@/components/Navbar"
import { Hero } from "@/components/Hero"
import { UploadSection } from "@/components/UploadSection"

const Page = () => {
  return (
    <main className="w-full min-h-screen bg-background">
      <Navbar />
      <Hero />
      <UploadSection />
    </main>
  )
}

export default Page