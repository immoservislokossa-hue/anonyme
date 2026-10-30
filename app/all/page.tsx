import type { Metadata } from "next";
import Link from "next/link";
import { ESPACES } from "@/lib/espaces";
import { PAYS, getPays, missingFor } from "@/lib/pays";

export const metadata: Metadata = {
  title: "Alviosa : toutes les parties",
  description: "Une plateforme de planification familiale pour les jeunes, les prestataires et les décideurs, construite sur le guide de l'OMS.",
};

const THREAD = [
  { titre: "1. Un jeune comprend et se prépare", texte: "Il trouve une information claire, fait « Je prépare ma visite » et sait quoi demander." },
  { titre: "2. Il est orienté vers un service réel", texte: "L'annuaire montre les services qui accueillent les jeunes et les méthodes disponibles." },
  { titre: "3. Le prestataire le conseille sans juger", texte: "Il suit la consultation guidée de l'OMS, présente les autres méthodes et les effets, et s'entraîne avant." },
  { titre: "4. Le jeune donne son retour, anonymement", texte: "A-t-on parlé d'autres méthodes ? Des effets ? A-t-il été accueilli sans jugement ?" },
  { titre: "5. Le décideur voit et agit", texte: "Le tableau de bord montre la qualité du conseil, les ruptures et les besoins, par zone." },
];

const ADOPTION = [
  "Un ministère renseigne le pays : zones, numéros officiels, protocole national.",
  "Des cliniciens relisent le contenu et signent la version.",
  "Les services s'inscrivent, le district valide l'annuaire.",
  "Les chiffres anonymes alimentent le dialogue Santé-Finances et le suivi des résultats pour les jeunes.",
];

export default function AllPage() {
  const benin = getPays();
  const missing = missingFor(benin);
  const others = PAYS.filter((p) => p.code !== benin.code);

  return (
    <>
      <div data-space="plateforme" hidden />
      <header className="all-hero">
        <p className="eyebrow">Planification familiale · Afrique de l'Ouest francophone</p>
        <h1>Une plateforme, trois espaces, un seul objectif : que les jeunes aient le choix.</h1>
        <p className="lede">
          Alviosa relie les jeunes, les prestataires de santé et les décideurs. Elle s'appuie sur le guide de l'OMS et sur les priorités du
          Partenariat de Ouagadougou, et elle fonctionne aussi sans connexion.
        </p>
      </header>

      <section aria-labelledby="espaces">
        <h2 id="espaces">Choisis ton espace</h2>
        <ul className="doors">
          {ESPACES.map((espace) => (
            <li key={espace.id}>
              <Link href={espace.href} className={`door door-${espace.id}`}>
                <span className="door-for">{espace.pour}</span>
                <strong>{espace.nom}</strong>
                <span>{espace.promesse}</span>
                <span className="door-go">Entrer</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="fil">
        <h2 id="fil">Le fil qui relie tout</h2>
        <p className="muted">Les trois espaces ne sont pas séparés : ils forment une boucle, du jeune jusqu'à la décision.</p>
        <ol className="thread">
          {THREAD.map((step) => (
            <li key={step.titre}>
              <strong>{step.titre}</strong>
              <span>{step.texte}</span>
            </li>
          ))}
        </ol>
        <div className="row">
          <Link className="btn primary" href="/orientation">
            Voir l'annuaire des services
          </Link>
          <Link className="btn ghost" href="/a-propos">
            Données et preuves
          </Link>
        </div>
      </section>

      <section className="panel" aria-labelledby="pays">
        <h2 id="pays">Pour les pays : comment s'approprier Alviosa</h2>
        <ol className="plain">
          {ADOPTION.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
        <h3>État actuel : {benin.nom}</h3>
        <p className="muted">À renseigner avant un usage réel : {missing.join(", ").toLowerCase()}.</p>
        <p className="muted">Autres pays du Partenariat prévus, pas encore configurés : {others.map((p) => p.nom).join(", ")}.</p>
      </section>

      <p className="notice">
        Alviosa n'est affiliée ni au Partenariat de Ouagadougou ni à l'OMS. Le contenu est un brouillon en cours de validation par des
        professionnels de santé. Aucune donnée réelle n'est affichée tant qu'aucun service n'est inscrit.
      </p>
    </>
  );
}
