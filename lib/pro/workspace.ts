// Espace de travail d'un service : le guide de démarrage (onboarding) et l'état des étapes.
import type { Service } from "@/lib/services";

export type FlagId = "carte" | "stock" | "visite" | "accueil";
export type Flags = Record<FlagId, boolean>;
export const NO_FLAGS: Flags = { carte: false, stock: false, visite: false, accueil: false };

export type Step = { id: string; titre: string; texte: string; fait: boolean; href: string; cta: string };

type Input = { enabled: boolean; loggedIn: boolean; hasToken: boolean; service: Pick<Service, "statut"> | null; flags: Flags };

const BASE = "/prestataires/mon-service";

export function onboarding(input: Input): { steps: Step[]; done: number; total: number; next: Step | null } {
  const { enabled, loggedIn, hasToken, service, flags } = input;
  const valid = service?.statut === "valide";
  const registered = service !== null || hasToken;
  const steps: Step[] = [
    {
      id: "compte",
      titre: enabled ? "Crée ton compte" : "Accès à ton service",
      texte: enabled ? "Un e-mail et un mot de passe. Ton service est rattaché à ton compte." : "Le jeton de gestion donné à l'inscription te sert d'accès.",
      fait: loggedIn || hasToken,
      href: "/connexion",
      cta: "Me connecter",
    },
    { id: "fiche", titre: "Inscris ton service", texte: "Nom, lieu, méthodes proposées. Deux minutes.", fait: registered, href: `${BASE}/fiche`, cta: "Remplir ma fiche" },
    {
      id: "validation",
      titre: "Fais valider ta fiche",
      texte: service?.statut === "refuse" ? "Ta fiche a été refusée. Corrige-la et contacte l'équipe." : "Un responsable de district vérifie ta fiche. Ensuite, les jeunes te trouvent dans l'annuaire.",
      fait: valid,
      href: `${BASE}/fiche`,
      cta: "Voir ma fiche",
    },
    { id: "carte", titre: "Affiche ta carte QR", texte: "Un jeune qui la scanne prépare sa visite. Chaque passage est compté, sans identité.", fait: flags.carte, href: `${BASE}/carte`, cta: "Ouvrir ma carte" },
    { id: "stock", titre: "Signale ton stock", texte: "Une rupture signalée évite un déplacement pour rien.", fait: flags.stock, href: `${BASE}/stock`, cta: "Mettre à jour le stock" },
    { id: "visite", titre: "Confirme ta première visite", texte: "Un jeune te montre son code : tu le saisis, la visite est comptée.", fait: flags.visite, href: `${BASE}/visites`, cta: "Confirmer une visite" },
  ];
  const done = steps.filter((s) => s.fait).length;
  return { steps, done, total: steps.length, next: steps.find((s) => !s.fait) ?? null };
}
