import type { MetadataRoute } from "next";
import { METHODES, SUJETS, TOOLS, hrefOf } from "@/lib/catalog";
import { SCENARIOS } from "@/lib/pro/scenarios";
import { SITE_PAGES } from "@/lib/site";
import { stories } from "@/lib/stories";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/apprendre",
    "/sujets",
    "/outils",
    "/methodes",
    "/serie",
    ...SITE_PAGES.filter((p) => !p.href.startsWith("/pilotage")).map((p) => p.href.split("#")[0]),
    ...SUJETS.map((s) => hrefOf.sujet(s.id)),
    ...TOOLS.map((t) => hrefOf.outil(t.id)),
    ...METHODES.map((m) => hrefOf.methode(m.id)),
    ...stories.map((e) => hrefOf.episode(e.id)),
    ...SCENARIOS.map((s) => `/prestataires/entrainement/${s.id}`),
  ];
  return [...new Set(paths)].map((path) => ({ url: `${BASE}${path}`, changeFrequency: "monthly" as const, priority: path === "/" ? 1 : 0.7 }));
}
