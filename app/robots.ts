import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resumecheck.example.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/result", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
