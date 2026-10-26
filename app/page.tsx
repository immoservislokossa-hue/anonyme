import Link from "next/link";
import ProgressCard from "@/components/ProgressCard";
import { ASSISTANT_NAME, TAGLINE } from "@/lib/brand";

const services = [
  { href: "/chat", title: `Parler à ${ASSISTANT_NAME}`, text: "Posez votre question, à l'écrit ou à la voix.", tone: "indigo" },
  { href: "/quiz", title: "Vrai ou faux", text: "Testez vos connaissances en 2 minutes et gagnez des points.", tone: "soleil" },
  { href: "/orientation", title: "Trouver un centre", text: "Les structures partenaires et la préparation de votre visite.", tone: "" },
  { href: "/chroniques", title: "Écouter les chroniques", text: "De courts récits sur des situations du quotidien.", tone: "" },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Bienvenue</p>
        <h1>{TAGLINE}</h1>
        <p className="lede">
          Posez vos questions sans gêne, sans jugement. Personne ne voit ce que vous faites ici.
        </p>
        <div className="row" style={{ marginTop: 18 }}>
          <Link href="/chat" className="btn indigo big">
            Poser ma question
          </Link>
          <Link href="/urgence" className="btn ghost big">
            C'est urgent
          </Link>
        </div>
      </section>

      <ProgressCard />

      <section aria-label="Services">
        <h2>Par où commencer ?</h2>
        <div className="cards">
          {services.map((service) => (
            <Link key={service.href} href={service.href} className={`card ${service.tone}`}>
              <strong>{service.title}</strong>
              <span>{service.text}</span>
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
