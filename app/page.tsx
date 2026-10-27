import Link from "next/link";
import Icon, { type IconName } from "@/components/Icon";

const entries: { href: string; icon: IconName; title: string; text: string }[] = [
  { href: "/chat?voie=sexuelle", icon: "chat", title: "Parler", text: "Pose ta question à Afi." },
  { href: "/apprendre", icon: "book", title: "Apprendre", text: "Les méthodes et des histoires." },
  { href: "/orientation", icon: "pin", title: "Trouver un centre", text: "Près de chez toi." },
];

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <h1>Choisir sa contraception, sans honte et sans jugement.</h1>
        <p>Des réponses claires, personne ne voit ce que tu fais ici.</p>
        <Link href="/chat?voie=sexuelle" className="btn indigo big" data-tour="ask">
          <Icon name="chat" size={20} />
          Poser ma question
        </Link>
      </section>

      <ul className="home-entries">
        {entries.map((entry) => (
          <li key={entry.href}>
            <Link href={entry.href}>
              <span className="home-icon">
                <Icon name={entry.icon} size={22} />
              </span>
              <span>
                <strong>{entry.title}</strong>
                <span>{entry.text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="home-note">
        <Link href="/urgence">C'est urgent ? Que faire maintenant</Link>
        <span>Contenu en cours de validation par des professionnels de santé.</span>
      </p>
    </>
  );
}
