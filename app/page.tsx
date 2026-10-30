import Link from "next/link";
import AskAfi from "@/components/AskAfi";
import Icon from "@/components/Icon";
import MyPlanCard from "@/components/MyPlanCard";
import OtherChannels from "@/components/OtherChannels";
import ShareButton from "@/components/ShareButton";
import { TARGET_LABEL } from "@/lib/brand";
import { HOME_LINKS, HOME_NEEDS } from "@/lib/home";

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <p className="eyebrow">{TARGET_LABEL}</p>
        <h1>Décide quand avoir un enfant.</h1>
        <p>Planification familiale : des réponses claires, sans jugement. Personne ne voit ce que tu fais ici.</p>
      </section>

      <MyPlanCard />

      <section aria-labelledby="needs-title" className="home-needs-block">
        <h2 id="needs-title">Où en es-tu ?</h2>
        <ul className="triage">
          {HOME_NEEDS.map((need) => (
            <li key={need.href}>
              <Link href={need.href} className={need.urgent ? "urgent" : undefined}>
                <span className="home-icon">
                  <Icon name={need.icon} size={24} />
                </span>
                <span className="triage-text">
                  <strong>{need.title}</strong>
                  <span>{need.text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <nav className="home-more" aria-label="Aller plus loin">
        {HOME_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
        <AskAfi className="link-btn">Poser une question à Afi</AskAfi>
      </nav>

      <OtherChannels />

      <ul className="trust" aria-label="Ce que tu peux savoir">
        <li>Gratuit, sans compte</li>
        <li>Fondé sur le guide de l'OMS</li>
        <li>Marche aussi sans internet</li>
      </ul>

      <p className="home-note">
        <span>
          Contenu en cours de validation par des professionnels de santé. <Link href="/a-propos">Sur quoi on s'appuie</Link>
        </span>
        <Link href="/urgence">C'est urgent ? Que faire maintenant</Link>
      </p>

      <div className="home-share">
        <ShareButton label="Envoyer Alviosa à une amie" />
      </div>
    </>
  );
}
