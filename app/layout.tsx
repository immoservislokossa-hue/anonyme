import AfiBubble from "@/components/AfiBubble";
import { QuickExitKey } from "@/components/QuickExit";
import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";
import Link from "next/link";
import DesktopNav from "@/components/DesktopNav";
import AudioHelp from "@/components/AudioHelp";
import Icon from "@/components/Icon";
import Logo from "@/components/Logo";
import MoreMenu from "@/components/MoreMenu";
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
  interactiveWidget: "resizes-content",
  themeColor: "#C2185B",
};

const footerLinks = [
  { href: "/aide#ia", label: "Comment fonctionne l'IA" },
  { href: "/aide#confidentialite", label: "Confidentialité" },
  { href: "/a-propos", label: "À propos et preuves" },
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
            <div className="topbar-actions">
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
        <QuickExitKey />
        <AfiBubble />
        <RegisterSW />
      </body>
    </html>
  );
}
