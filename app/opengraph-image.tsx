import { ImageResponse } from "next/og";

export const alt = "Alviosa : planification familiale pour les jeunes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// L'image qui s'affiche quand on partage Alviosa sur WhatsApp, Facebook ou ailleurs.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#fffaf7", color: "#2b1a26", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", width: 84, height: 84, borderRadius: 26, background: "#c2185b", alignItems: "center", justifyContent: "center" }}>
            <div style={{ display: "flex", width: 40, height: 40, borderRadius: 40, background: "#00c9b1", marginRight: -14 }} />
            <div style={{ display: "flex", width: 40, height: 40, borderRadius: 40, background: "#ffffff" }} />
          </div>
          <div style={{ fontSize: 44, fontWeight: 800 }}>Alviosa</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, color: "#c2185b" }}>Décide quand avoir un enfant.</div>
          <div style={{ fontSize: 36, color: "#6b5663" }}>Des réponses claires, sans jugement. Pour les jeunes, les prestataires et les décideurs.</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 28, fontWeight: 700 }}>
          <div style={{ display: "flex", padding: "10px 22px", borderRadius: 999, background: "#fde8f0", color: "#9c1250" }}>Jeunes</div>
          <div style={{ display: "flex", padding: "10px 22px", borderRadius: 999, background: "#dff4f0", color: "#075a50" }}>Prestataires</div>
          <div style={{ display: "flex", padding: "10px 22px", borderRadius: 999, background: "#e4e8f6", color: "#141f4a" }}>Pilotage</div>
        </div>
      </div>
    ),
    size,
  );
}
