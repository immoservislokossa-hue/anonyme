import Link from "next/link";
import AskAfi from "@/components/AskAfi";
import Icon from "@/components/Icon";
import MyPlanCard from "@/components/MyPlanCard";
import OfflineStatus from "@/components/OfflineStatus";
import OtherChannels from "@/components/OtherChannels";
import ShareButton from "@/components/ShareButton";
import Silhouette from "@/components/Silhouette";
import { TARGET_LABEL } from "@/lib/brand";
import { HOME_NEEDS } from "@/lib/home";

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
        <h1>Ta planification familiale, de A à Z.</h1>
        <p>Choisir une méthode, attendre ou espacer une grossesse, te protéger des IST, préparer ta visite au centre : tout est ici, sans honte et sans jugement. Personne ne voit ce que tu fais.</p>
        <AskAfi className="btn primary big">Poser ma question à Afi</AskAfi>
      </section>

      <MyPlanCard />

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

      <OfflineStatus />

      <div className="home-share">
        <ShareButton label="Envoyer Alviosa à une amie" />
      </div>

      <p className="home-note">
        <span>Contenu en cours de validation par des professionnels de santé.</span>
        <Link href="/urgence">C'est urgent ? Que faire maintenant</Link>
      </p>
    </>
  );
}
