import type { IconName } from "@/components/Icon";

// Une question simple pour s'orienter : où en es-tu ? Quatre situations, quatre pages. Chacune mène à un outil ou un sujet.
export const HOME_NEEDS: { href: string; icon: IconName; title: string; text: string; urgent?: boolean }[] = [
  { href: "/outils/choisir", icon: "check", title: "Je veux choisir une méthode", text: "Quelques questions, 2 minutes." },
  { href: "/outils/plan", icon: "home", title: "J'ai déjà une méthode", text: "Rappels, oubli, souci." },
  { href: "/outils/risque", icon: "alert", title: "J'ai pris un risque", text: "La pilule d'urgence marche mieux plus tôt.", urgent: true },
  { href: "/sujets/grossesse", icon: "heart", title: "J'ai un retard de règles", text: "Test, grossesse, à qui parler." },
];

// Pour aller plus loin, sans encombrer l'écran.
export const HOME_LINKS: { href: string; label: string }[] = [
  { href: "/outils/visite", label: "Préparer ma visite au centre" },
  { href: "/outils/parler", label: "Parler à quelqu'un" },
  { href: "/apprendre", label: "Tout apprendre" },
];
