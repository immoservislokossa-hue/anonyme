import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import PrintButton from "@/components/PrintButton";
import { serviceByCode } from "@/lib/directory";
import { typeLabel } from "@/lib/services";
import { isCode } from "@/lib/tokens";

export const metadata: Metadata = { title: "Carte du service", robots: { index: false } };
export const dynamic = "force-dynamic";

// La carte à imprimer et à remettre ou afficher : un QR qui mène à la page du service. Chaque passage est compté, sans identité.
export default async function CartePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const upper = code.toUpperCase();
  const service = isCode(upper) ? await serviceByCode(upper) : null;
  if (!service) notFound();

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? `${proto}://${host}`;
  const link = `${base}/r/${upper}`;
  const svg = await QRCode.toString(link, { type: "svg", margin: 1, width: 240, errorCorrectionLevel: "M", color: { dark: "#2b1a26", light: "#ffffff" } });

  return (
    <article className="service-card-print">
      <p className="no-print muted">Imprime cette page et affiche-la, ou donne-la aux jeunes. Chaque scan est compté, sans aucune identité.</p>
      <div className="print-card">
        <p className="print-brand">Alviosa</p>
        <h1>Avant ta visite, prépare tes questions</h1>
        <div className="print-qr" dangerouslySetInnerHTML={{ __html: svg }} role="img" aria-label={`QR code vers ${service.nom}`} />
        <p className="print-service">
          <strong>{service.nom}</strong>
          <br />
          {typeLabel(service.type)} · {service.commune}
        </p>
        <p className="print-steps">Scanne · Prépare ta visite · Viens sans honte. Gratuit, sans compte.</p>
        <p className="print-link">{link.replace(/^https?:\/\//, "")}</p>
      </div>
      <PrintButton />
    </article>
  );
}
