import type { IconName } from "@/components/Icon";

// Alviosa est une plateforme à trois espaces qui partagent le même socle : les jeunes, les prestataires, les décideurs.
export type EspaceId = "jeunes" | "prestataires" | "pilotage" | "plateforme";

export type Espace = { id: Exclude<EspaceId, "plateforme">; nom: string; pour: string; promesse: string; href: string };

export const ESPACES: Espace[] = [
  { id: "jeunes", nom: "Alviosa Jeunes", pour: "Les jeunes de 15 à 35 ans", promesse: "Comprendre, choisir, aller au centre préparé. Sans jugement, sans compte, même sans internet.", href: "/" },
  { id: "prestataires", nom: "Alviosa Prestataires", pour: "Agents de santé, sages-femmes, pharmaciens", promesse: "Conseiller sans juger : une consultation guidée, des jeux de rôle avec de faux clients jeunes, les aide-mémoire de l'OMS.", href: "/prestataires" },
  { id: "pilotage", nom: "Alviosa Pilotage", pour: "Responsables de district, ministères, partenaires", promesse: "Voir ce que les jeunes demandent, la qualité du conseil et les services disponibles, avec des données anonymes.", href: "/pilotage" },
];

export function espaceOf(pathname: string): EspaceId {
  if (pathname === "/all" || pathname.startsWith("/all/")) return "plateforme";
  if (pathname.startsWith("/prestataires") || pathname.startsWith("/pro")) return "prestataires";
  if (pathname.startsWith("/pilotage") || pathname.startsWith("/partenaires")) return "pilotage";
  return "jeunes";
}

export type NavItem = { href: string; label: string; icon: IconName; tour?: string };

export const NAV: Record<EspaceId, NavItem[]> = {
  jeunes: [
    { href: "/apprendre", label: "Apprendre", icon: "book", tour: "tab-learn" },
    { href: "/orientation", label: "Centres", icon: "pin", tour: "tab-centres" },
    { href: "/urgence", label: "Urgence", icon: "alert", tour: "urgent" },
  ],
  prestataires: [
    { href: "/prestataires/consultation", label: "Consultation", icon: "check" },
    { href: "/prestataires/entrainement", label: "Entraînement", icon: "chat" },
    { href: "/prestataires/aide-memoire", label: "Aide-mémoire", icon: "book" },
    { href: "/prestataires/mon-service", label: "Mon service", icon: "pin" },
  ],
  pilotage: [
    { href: "/pilotage", label: "Tableau de bord", icon: "star" },
    { href: "/pilotage/services", label: "Services", icon: "pin" },
    { href: "/pilotage/valider", label: "Inscriptions", icon: "check" },
  ],
  plateforme: [
    { href: "/", label: "Jeunes", icon: "heart" },
    { href: "/prestataires", label: "Prestataires", icon: "check" },
    { href: "/pilotage", label: "Pilotage", icon: "star" },
  ],
};

// Où mène le logo : vers l'accueil de l'espace où l'on est.
export function brandHref(espace: EspaceId): string {
  if (espace === "prestataires") return "/prestataires";
  if (espace === "pilotage") return "/pilotage";
  if (espace === "plateforme") return "/all";
  return "/";
}

export const ESPACE_LABEL: Record<EspaceId, string> = {
  jeunes: "Alviosa",
  prestataires: "Alviosa Prestataires",
  pilotage: "Alviosa Pilotage",
  plateforme: "Alviosa",
};
