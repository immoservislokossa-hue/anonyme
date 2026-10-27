import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import DesktopNav from "@/components/DesktopNav";
import Logo from "@/components/Logo";
import RegisterSW from "@/components/RegisterSW";
import { APP_NAME, TAGLINE } from "@/lib/brand";
import "./globals.css";

// Police de la marque, servie par le site lui-même.
const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  display: "swap",
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: { default: APP_NAME, template: `%s · ${APP_NAME}` },
  description: TAGLINE,
  applicationName: APP_NAME,
  appleWebApp: { capable: true, title: APP_NAME, statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#3D3BD9",
};

const footerLinks = [
  { href: "/ia", label: "Comment fonctionne l'IA" },
  { href: "/consentement", label: "Confidentialité" },
  { href: "/aide", label: "Aide" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={figtree.variable}>
      <body>
        <a className="skip" href="#contenu">
          Aller au contenu
        </a>
        <div className="page">
          <header className="topbar">
            <Link href="/" className="brand" aria-label={`${APP_NAME}, accueil`}>
              <Logo size={36} />
              <span>{APP_NAME}</span>
            </Link>
            <DesktopNav />
          </header>

          <main id="contenu">{children}</main>

          <footer className="footer">
            <nav aria-label="Autres pages">
              {footerLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <p className="muted">
              Service d'information automatisé. Il ne remplace pas un professionnel de santé. Contenu en cours de
              validation.
            </p>
          </footer>
        </div>
        <BottomNav />
        <RegisterSW />
      </body>
    </html>
  );
}
