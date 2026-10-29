import Link from "next/link";
import Icon from "@/components/Icon";
import OtherChannels from "@/components/OtherChannels";
import Silhouette from "@/components/Silhouette";
import { TARGET_LABEL } from "@/lib/brand";
import { HOME_NEEDS } from "@/lib/topics";

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="home-trio" aria-hidden="true">
          <Silhouette voie="sexuelle" size={56} bust />
          <Silhouette voie="mentale" size={56} bust />
          <Silhouette voie="bien-etre" size={56} bust />
        </div>
        <p className="home-age">{TARGET_LABEL}</p>
        <h1>Choisir sa contraception, sans honte et sans jugement.</h1>
        <p>Des réponses claires, personne ne voit ce que tu fais ici.</p>
        <Link href="/chat?voie=sexuelle" className="btn primary big" data-tour="ask">
          <Icon name="chat" size={20} />
          Poser ma question
        </Link>
      </section>

      <section aria-labelledby="needs-title" className="home-needs-block">
        <h2 id="needs-title">Que veux-tu faire ?</h2>
        <ul className="home-needs">
          {HOME_NEEDS.map((need) => (
            <li key={need.href}>
              <Link href={need.href} className={need.urgent ? "urgent" : undefined}>
                <span className="home-icon">
                  <Icon name={need.icon} size={22} />
                </span>
                <strong>{need.title}</strong>
                <span>{need.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <OtherChannels />

      <p className="home-note">
        <span>Contenu en cours de validation par des professionnels de santé.</span>
        <Link href="/urgence">C'est urgent ? Que faire maintenant</Link>
      </p>
    </>
  );
}
