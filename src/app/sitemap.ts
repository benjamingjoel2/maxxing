import type { MetadataRoute } from "next";
import { destinations } from "@/data/destinations";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://maxxing.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/destinations`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/experiences`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/plan`, changeFrequency: "monthly", priority: 0.8 },
    ...destinations.map((d) => ({
      url: `${BASE}/destinations/${d.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
