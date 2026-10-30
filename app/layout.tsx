import AfiBubble from "@/components/AfiBubble";
import { QuickExitKey } from "@/components/QuickExit";
import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import Link from "next/link";
import DesktopNav from "@/components/DesktopNav";
import AudioHelp from "@/components/AudioHelp";
import SearchDialog from "@/components/SearchDialog";
import SpaceMenu from "@/components/SpaceMenu";
import Icon from "@/components/Icon";
import Brand from "@/components/Brand";
import MoreMenu from "@/components/MoreMenu";
import RegisterSW from "@/components/RegisterSW";
import { APP_NAME, TAGLINE } from "@/lib/brand";
import { FOOTER_COLUMNS } from "@/lib/site";
import "./globals.css";

// Police de la marque, servie par le site lui-même.
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  display: "swap",
  variable: "--font-figtree",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${APP_NAME} : planification familiale pour les jeunes`, template: `%s · ${APP_NAME}` },
  description: TAGLINE,
  applicationName: APP_NAME,
  appleWebApp: { capable: true, title: APP_NAME, statusBarStyle: "default" },
  openGraph: { type: "website", locale: "fr_FR", siteName: APP_NAME, title: `${APP_NAME} : planification familiale pour les jeunes`, description: TAGLINE },
  twitter: { card: "summary_large_image", title: APP_NAME, description: TAGLINE },
  alternates: { canonical: "/" },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: APP_NAME,
  description: TAGLINE,
  inLanguage: "fr",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#C2185B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={figtree.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
        <a className="skip" href="#contenu">
          Aller au contenu
        </a>
        <div className="page">
          <header className="topbar">
            <Brand />
            <DesktopNav />
            <div className="topbar-actions">
              <SearchDialog />
              <SpaceMenu />
              <AudioHelp />
              <Link href="/urgence" className="urgent-btn" data-tour="urgent" aria-label="Urgence : que faire maintenant">
                <Icon name="alert" size={20} />
                <span>Urgence</span>
              </Link>
              <MoreMenu />
            </div>
          </header>

          <main id="contenu">{children}</main>

          <footer className="footer">
            <div className="footer-cols">
              {FOOTER_COLUMNS.map((col) => (
                <nav key={col.titre} aria-label={col.titre}>
                  <h2>{col.titre}</h2>
                  <ul>
                    {col.liens.map((l) => (
                      <li key={l.href + l.label}>
                        <Link href={l.href}>{l.label}</Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
            <p className="muted">
              Alviosa informe et oriente : elle ne remplace pas un professionnel de santé. Contenu fondé sur le guide de l'OMS (2012), en cours de validation par des
              professionnels de santé. Alviosa n'est affiliée ni à l'OMS ni au Partenariat de Ouagadougou.
            </p>
          </footer>
        </div>
        <QuickExitKey />
        <AfiBubble />
        <RegisterSW />
      </body>
    </html>
  );
}
