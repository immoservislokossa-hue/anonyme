import type { EspaceId } from "@/lib/espaces";

// Le plan du site : une seule liste, utilisée par le pied de page, la recherche, le sitemap et le mode sans connexion.
export type SitePage = { href: string; titre: string; espace: EspaceId; texte: string };

export const SITE_PAGES: SitePage[] = [
  { href: "/all", titre: "Alviosa : toutes les parties", espace: "plateforme", texte: "plateforme jeunes prestataires décideurs boucle pays" },
  { href: "/a-propos", titre: "À propos et preuves", espace: "plateforme", texte: "données sources limites indicateurs Afrobaromètre PMA2020 OMS" },
  { href: "/accessibilite", titre: "Accessibilité", espace: "plateforme", texte: "accessibilité clavier lecteur d'écran contraste" },
  { href: "/aide", titre: "Aide, confidentialité et IA", espace: "jeunes", texte: "aide confidentialité données intelligence artificielle sans connexion" },
  { href: "/urgence", titre: "C'est urgent", espace: "jeunes", texte: "urgence violence danger pilule d'urgence" },
  { href: "/orientation", titre: "Trouver un centre", espace: "jeunes", texte: "centre de santé pharmacie service annuaire avis" },
  { href: "/prestataires", titre: "Alviosa Prestataires", espace: "prestataires", texte: "agent de santé sage-femme pharmacien conseil" },
  { href: "/prestataires/consultation", titre: "Consultation guidée", espace: "prestataires", texte: "consultation éligibilité méthodes qualité du conseil" },
  { href: "/prestataires/entrainement", titre: "Entraînement avec de faux clients", espace: "prestataires", texte: "jeu de rôle accueil sans jugement jeunes" },
  { href: "/prestataires/aide-memoire", titre: "Aide-mémoire OMS", espace: "prestataires", texte: "fiches méthodes délais listes de contrôle" },
  { href: "/prestataires/mon-service", titre: "Mon service", espace: "prestataires", texte: "inscrire service rupture stock QR carte accueil des jeunes" },
  { href: "/prestataires/bilan", titre: "Mon bilan", espace: "prestataires", texte: "bilan anonyme qualité du conseil" },
  { href: "/prestataires/assistant", titre: "Assistant OMS", espace: "prestataires", texte: "assistant question guide" },
  { href: "/pilotage", titre: "Alviosa Pilotage", espace: "pilotage", texte: "tableau de bord district ministère chiffres anonymes" },
  { href: "/pilotage/demo", titre: "Pilotage : démonstration", espace: "pilotage", texte: "démonstration tableau de bord alertes export" },
];

export const FOOTER_COLUMNS: { titre: string; liens: { href: string; label: string }[] }[] = [
  {
    titre: "Jeunes",
    liens: [
      { href: "/", label: "Accueil" },
      { href: "/apprendre", label: "Apprendre" },
      { href: "/outils/choisir", label: "Choisir ma méthode" },
      { href: "/orientation", label: "Trouver un centre" },
      { href: "/urgence", label: "C'est urgent" },
    ],
  },
  {
    titre: "Prestataires",
    liens: [
      { href: "/prestataires", label: "Alviosa Prestataires" },
      { href: "/prestataires/consultation", label: "Consultation guidée" },
      { href: "/prestataires/entrainement", label: "Entraînement" },
      { href: "/prestataires/mon-service", label: "Mon service" },
    ],
  },
  {
    titre: "Décideurs",
    liens: [
      { href: "/pilotage/demo", label: "Démonstration du tableau de bord" },
      { href: "/pilotage", label: "Accès Pilotage" },
      { href: "/all", label: "Appropriation par pays" },
    ],
  },
  {
    titre: "Alviosa",
    liens: [
      { href: "/a-propos", label: "À propos et preuves" },
      { href: "/aide#confidentialite", label: "Confidentialité" },
      { href: "/aide#ia", label: "Comment fonctionne l'IA" },
      { href: "/accessibilite", label: "Accessibilité" },
      { href: "/aide", label: "Aide" },
    ],
  },
];
