import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://resumecheck.example.com"

  return {
    rules: [
      // Google crawlers
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "Googlebot-Video",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "Googlebot-News",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "Storebot-Google",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      // Bing crawlers
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "MicrosoftPreview",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "AdIdxBot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "BingPreview",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "DuckDuckBot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      // Yahoo crawlers
      {
        userAgent: "Slurp",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      // Baidu crawlers
      {
        userAgent: "Baiduspider",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "Baiduspider-image",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "Baiduspider-video",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      // Yandex crawlers
      {
        userAgent: "YandexBot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "YandexImages",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      // Social media crawlers
      {
        userAgent: "facebookexternalhit",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "Twitterbot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "LinkedInBot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "WhatsApp",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "Applebot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      // Other major crawlers
      {
        userAgent: "Sogou",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "Exabot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "NaverBot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "SeznamBot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "AhrefsBot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "SemrushBot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "MJ12bot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "Pinterestbot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "Discordbot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "TelegramBot",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      // SEO/Analytics bots
      {
        userAgent: "Screaming Frog SEO Spider",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      {
        userAgent: "W3C_Validator",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      // Archive bots
      {
        userAgent: "ia_archiver",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
      // Catch-all for any other crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/result", "/api/", "/auth", "/dashboard"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
