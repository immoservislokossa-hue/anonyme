import type { IconName } from "@/components/Icon";

// Les besoins les plus fréquents, affichés en grand sur l'accueil. Chacun mène à une page précise.
export const HOME_NEEDS: { href: string; icon: IconName; title: string; text: string; urgent?: boolean }[] = [
  { href: "/outils/choisir", icon: "check", title: "Choisir ma méthode", text: "Quelques questions, 2 minutes." },
  { href: "/outils/risque", icon: "alert", title: "J'ai pris un risque", text: "Que faire, avant quand.", urgent: true },
  { href: "/sujets/grossesse", icon: "heart", title: "Retard de règles", text: "Test, grossesse, à qui parler." },
  { href: "/sujets/ist-vih", icon: "shield", title: "IST et VIH", text: "Se protéger, se faire dépister." },
  { href: "/sujets/relations", icon: "circles", title: "Relations et consentement", text: "Dire oui, dire non." },
  { href: "/orientation", icon: "pin", title: "Trouver un centre", text: "Près de chez toi." },
];
