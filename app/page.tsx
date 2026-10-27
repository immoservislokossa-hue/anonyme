import Link from "next/link";
import Icon from "@/components/Icon";
import Silhouette from "@/components/Silhouette";
import { PERSONAS } from "@/lib/brand";

const steps = [
  { title: "Comprendre", text: "Pose tes questions : méthodes, effets, rumeurs, droits.", href: "/chat?voie=sexuelle" },
  { title: "Choisir", text: "Compare les méthodes et prépare tes questions.", href: "/methodes" },
  { title: "Y aller", text: "Trouve un centre ou une pharmacie près de toi.", href: "/orientation" },
];

const more = [
  { href: "/apprendre", label: "Apprendre : méthodes, histoires, quiz" },
  { href: "/chat?voie=mentale", label: "Santé mentale" },
  { href: "/chat?voie=bien-etre", label: "Bien-être" },
  { href: "/ia", label: "Comment fonctionne l'IA" },
];

export default function HomePage() {
  return (
    <>
      <section className="hero wide">
        <p className="eyebrow">Planification familiale pour les jeunes</p>
        <h1>Choisir sa contraception, sans honte et sans jugement.</h1>
        <p className="lede">
          Des réponses claires à tes questions, un guide des méthodes et les centres près de chez toi. Personne ne voit ce
          que tu fais ici.
        </p>
        <div className="row hero-actions">
          <Link href="/chat?voie=sexuelle" className="btn indigo big" data-tour="ask">
            <Icon name="chat" size={20} />
            Poser ma question
          </Link>
          <Link href="/methodes" className="btn ghost big" data-tour="methods">
            Voir les méthodes
          </Link>
        </div>
        <p className="hero-urgent">
          <Link href="/urgence">Rapport non protégé ou urgence : que faire maintenant</Link>
        </p>
      </section>

      <section aria-label="Les trois étapes" className="wide">
        <h2>Comment ça marche</h2>
        <ol className="steps-row">
          {steps.map((step, index) => (
            <li key={step.title}>
              <Link href={step.href}>
                <span className="step-num">{index + 1}</span>
                <strong>{step.title}</strong>
                <span>{step.text}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Afi" className="wide meet">
        <span className="meet-fig">
          <Silhouette voie="sexuelle" size={150} framed={false} />
        </span>
        <div>
          <p className="eyebrow">
            {PERSONAS.sexuelle.name}, {PERSONAS.sexuelle.role}
          </p>
          <h2>Les questions qu'on n'ose pas poser, pose-les ici.</h2>
          <p className="muted">
            Afi explique les méthodes et démonte les rumeurs. Elle ne pose pas de diagnostic et t'oriente vers un
            professionnel quand il le faut.
          </p>
          <Link href="/chat?voie=sexuelle" className="btn indigo">
            Parler à Afi
          </Link>
        </div>
      </section>

      <section aria-label="Pour aller plus loin" className="wide">
        <h2>Pour aller plus loin</h2>
        <ul className="link-list">
          {more.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="notice">
        <Icon name="shield" size={18} />
        <span>Contenu en cours de validation par des professionnels de santé. Les informations affichées peuvent changer.</span>
      </p>
    </>
  );
}
