import Link from "next/link";
import ProgressCard from "@/components/ProgressCard";
import { ASSISTANT_NAME, TAGLINE } from "@/lib/brand";
import { VOIES } from "@/lib/domain";

const tools = [
  { href: "/quiz", title: "Vrai ou faux", text: "Testez vos connaissances en 2 minutes et gagnez des points." },
  { href: "/orientation", title: "Trouver un centre", text: "Les structures partenaires et la préparation de votre visite." },
  { href: "/chroniques", title: "Écouter les chroniques", text: "De courts récits sur des situations du quotidien." },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Bienvenue</p>
        <h1>{TAGLINE}</h1>
        <p className="lede">Posez vos questions sans gêne, sans jugement. Personne ne voit ce que vous faites ici.</p>
        <div className="row" style={{ marginTop: 18 }}>
          <Link href="/chat" className="btn indigo big">
            Poser ma question
          </Link>
          <Link href="/urgence" className="btn ghost big">
            C'est urgent
          </Link>
        </div>
      </section>

      <section aria-label="Sujets">
        <h2>Choisissez un sujet avec {ASSISTANT_NAME}</h2>
        <div className="cards">
          {VOIES.map((voie) => (
            <Link key={voie.id} href={`/chat?voie=${voie.id}`} className="card soleil">
              <strong>{voie.label}</strong>
              <span>{voie.description}</span>
            </Link>
          ))}
        </div>
      </section>

      <ProgressCard />

      <section aria-label="Outils">
        <h2>Pour aller plus loin</h2>
        <div className="cards">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="card">
              <strong>{tool.title}</strong>
              <span>{tool.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <p className="notice">
        Contenu en cours de validation par des professionnels de santé. Les informations affichées peuvent changer.
      </p>
    </>
  );
}
