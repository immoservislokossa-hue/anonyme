import type { Metadata } from "next";
import Link from "next/link";
import AccountPanel from "@/components/AccountPanel";

export const metadata: Metadata = { title: "Connexion", robots: { index: false } };

export default function ConnexionPage() {
  return (
    <>
      <div data-space="plateforme" hidden />
      <header>
        <h1>Se connecter ou créer un compte</h1>
        <p className="lede">Pour les services de santé qui gèrent leur fiche, et pour les responsables de district, de ministère ou de partenaire. Les jeunes n'ont pas besoin de compte.</p>
      </header>
      <AccountPanel audience="prestataire" redirect />
      <section className="panel" aria-labelledby="qui">
        <h2 id="qui">Quel compte ?</h2>
        <ul className="plain">
          <li>
            <strong>Service de santé :</strong> crée ton compte toi-même, puis inscris ton service. Voir <Link href="/prestataires/offres">les offres</Link>.
          </li>
          <li>
            <strong>Responsable Pilotage :</strong> le compte est créé avec toi par l'équipe du projet, qui donne l'accès au tableau de bord. Voir <Link href="/pilotage/demo">la démonstration</Link>.
          </li>
        </ul>
      </section>
    </>
  );
}
