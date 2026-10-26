import Link from "next/link";
import Icon, { type IconName } from "@/components/Icon";
import ProgressCard from "@/components/ProgressCard";
import { ASSISTANT_NAME, TAGLINE } from "@/lib/brand";
import { VOIES, type Voie } from "@/lib/domain";

const VOIE_ICONS: Record<Voie, IconName> = {
  sexuelle: "circles",
  mentale: "heart",
  "bien-etre": "sun",
};

const tools: { href: string; title: string; text: string; icon: IconName }[] = [
  { href: "/quiz", title: "Vrai ou faux", text: "Testez vos connaissances en 2 minutes et gagnez des points.", icon: "quiz" },
  { href: "/orientation", title: "Trouver un centre", text: "Les structures partenaires et la préparation de votre visite.", icon: "pin" },
  { href: "/chroniques", title: "Écouter les chroniques", text: "De courts récits sur des situations du quotidien.", icon: "book" },
];

const [before, after] = TAGLINE.split("bien-être");

export default function HomePage() {
  return (
    <>
      <section className="hero wide">
        <p className="eyebrow">Bienvenue</p>
        <h1>
          {before}
          <span className="nowrap">bien-être</span>
          {after}
        </h1>
        <p className="lede">Posez vos questions sans gêne, sans jugement. Personne ne voit ce que vous faites ici.</p>
        <div className="row hero-actions">
          <Link href="/chat" className="btn indigo big">
            <Icon name="chat" size={20} />
            Poser ma question
          </Link>
          <Link href="/urgence" className="btn ghost big">
            C'est urgent
          </Link>
        </div>
      </section>

      <section aria-label="Sujets" className="wide">
        <h2>Choisissez un sujet avec {ASSISTANT_NAME}</h2>
        <div className="cards">
          {VOIES.map((voie) => (
            <Link key={voie.id} href={`/chat?voie=${voie.id}`} className={`card tone-${voie.id}`}>
              <span className="tile">
                <Icon name={VOIE_ICONS[voie.id]} size={26} />
              </span>
              <span className="card-text">
                <strong>{voie.label}</strong>
                <span>{voie.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ProgressCard />

      <section aria-label="Outils" className="wide">
        <h2>Pour aller plus loin</h2>
        <div className="cards">
          {tools.map((tool) => (
            <Link key={tool.href} href={tool.href} className="card plain-card">
              <span className="tile neutral">
                <Icon name={tool.icon} size={24} />
              </span>
              <span className="card-text">
                <strong>{tool.title}</strong>
                <span>{tool.text}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <p className="notice">
        <Icon name="shield" size={18} />
        <span>Contenu en cours de validation par des professionnels de santé. Les informations affichées peuvent changer.</span>
      </p>
    </>
  );
}
