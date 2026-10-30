import type { MetadataRoute } from "next";
import { APP_NAME, TAGLINE } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: `${APP_NAME} : planification familiale`,
    short_name: APP_NAME,
    description: TAGLINE,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFFAF7",
    theme_color: "#C2185B",
    lang: "fr",
    categories: ["health", "medical", "education"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "J'ai pris un risque", short_name: "Risque", url: "/outils/risque" },
      { name: "Choisir ma méthode", short_name: "Choisir", url: "/outils/choisir" },
      { name: "C'est urgent", short_name: "Urgence", url: "/urgence" },
      { name: "Alviosa Prestataires", short_name: "Prestataires", url: "/prestataires" },
    ],
  };
}
