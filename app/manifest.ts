import type { MetadataRoute } from "next";
import { APP_NAME, TAGLINE } from "@/lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    description: TAGLINE,
    start_url: "/",
    display: "standalone",
    background_color: "#FFFAF7",
    theme_color: "#C2185B",
    lang: "fr",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
