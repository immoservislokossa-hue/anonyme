import type { Metadata } from "next";
import Crumbs from "@/components/Crumbs";
import MethodsBrowser, { type MethodCardData } from "@/components/MethodsBrowser";
import Icon from "@/components/Icon";
import { METHODES, TIER_NAMES, TIER_ORDER } from "@/lib/catalog";

export const metadata: Metadata = { title: "Méthodes" };

export default function MethodesPage() {
  const cards: MethodCardData[] = METHODES.map((m) => ({
    id: m.id,
    nom: m.nom,
    niveau: m.niveau,
    niveau_label: m.niveau_label,
    frequence: m.frequence,
    ist: m.ist,
    hormonale: m.hormonale,
    reversible: m.reversible,
    ou: m.ou,
    pour: m.pour,
    accroche: m.resume[0] ?? "",
  }));
  const tiers = TIER_ORDER.map((niveau) => ({ niveau, titre: TIER_NAMES[niveau] }));

  return (
    <>
      <Crumbs current="Méthodes" />
      <header>
        <h1>Les méthodes</h1>
        <p className="lede">Classées de la plus efficace à la moins efficace. Touche une méthode pour tout savoir, ou coche « Comparer ».</p>
      </header>

      <p className="notice important">
        <Icon name="shield" size={18} />
        <span>
          <strong>Important !</strong> Seuls les préservatifs protègent à la fois de la grossesse et des IST, dont le VIH/sida.
        </span>
      </p>

      <MethodsBrowser methods={cards} tiers={tiers} />

      <p className="notice">
        <Icon name="shield" size={18} />
        <span>Contenu établi à partir du Guide de la planification familiale de l'OMS (2012), en cours de validation par des professionnels de santé.</span>
      </p>
    </>
  );
}
