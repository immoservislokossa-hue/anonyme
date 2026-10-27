import Link from "next/link";
import Icon, { type IconName } from "@/components/Icon";
import ProgressCard from "@/components/ProgressCard";
import Silhouette from "@/components/Silhouette";
import { ALSO, PERSONAS } from "@/lib/brand";

const steps: { title: string; text: string; href: string; icon: IconName }[] = [
  { title: "Comprendre", text: "Posez vos questions à Afi : méthodes, effets, rumeurs, droits.", href: "/chat?voie=sexuelle", icon: "chat" },
  { title: "Choisir", text: "Comparez les méthodes et préparez vos questions pour un professionnel.", href: "/methodes", icon: "shield" },
  { title: "Y aller", text: "Trouvez un centre ou une pharmacie près de vous et préparez votre visite.", href: "/orientation", icon: "pin" },
];

const barriers = [
  { title: "Les rumeurs", text: "Des réponses claires, issues de sources contrôlées, pas des on-dit." },
  { title: "La peur d'être vu", text: "Aucun message n'est conservé. Pas de compte, pas de nom." },
  { title: "Le jugement", text: "Un ton sans morale, avec une préparation de visite pour oser demander." },
  { title: "L'âge et le statut", text: "Une information pour toutes et tous, mariés ou non, jeunes ou plus âgés." },
];

const tools: { href: string; title: string; text: string; icon: IconName }[] = [
  { href: "/quiz", title: "Vrai ou faux", text: "Testez vos connaissances en 2 minutes et gagnez des points.", icon: "quiz" },
  { href: "/chroniques", title: "Histoires à vivre", text: "En images, en jeu à choix ou en dessin animé : trois amies, des situations vraies.", icon: "book" },
  { href: "/ia", title: "Comment fonctionne l'IA", text: "Ce qu'elle fait, ce qu'elle ne fait pas, comment elle est testée.", icon: "circles" },
];

export default function HomePage() {
  return (
    <>
      <section className="hero wide">
        <p className="eyebrow">Planification familiale · jeunes · Afrique de l'Ouest</p>
        <h1>Choisir sa contraception, sans honte et sans jugement.</h1>
        <p className="lede">
          Alviosa répond à vos questions sur la planification familiale, vous aide à choisir une méthode et vous guide vers un
          centre près de chez vous. Personne ne voit ce que vous faites ici.
        </p>
        <div className="row hero-actions">
          <Link href="/chat?voie=sexuelle" className="btn indigo big">
            <Icon name="chat" size={20} />
            Poser ma question
          </Link>
          <Link href="/methodes" className="btn ghost big">
            Quelle méthode ?
          </Link>
        </div>
        <p className="hero-urgent">
          <Link href="/urgence">Après un rapport non protégé ou en cas d'urgence : que faire maintenant</Link>
        </p>
      </section>

      <section aria-label="Les trois étapes" className="wide">
        <h2>Trois étapes, à votre rythme</h2>
        <div className="cards">
          {steps.map((step, index) => (
            <Link key={step.title} href={step.href} className="card plain-card">
              <span className="tile">
                <Icon name={step.icon} size={24} />
              </span>
              <span className="card-text">
                <strong>
                  {index + 1}. {step.title}
                </strong>
                <span>{step.text}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-label="Afi" className="wide meet tone-sexuelle">
        <span className="sil-tile big">
          <Silhouette voie="sexuelle" size={170} framed={false} />
        </span>
        <div>
          <p className="eyebrow">
            {PERSONAS.sexuelle.name}, {PERSONAS.sexuelle.role}
          </p>
          <h2>Les questions qu'on n'ose pas poser, posez-les ici.</h2>
          <p>
            Afi explique les méthodes, démonte les rumeurs et répond simplement. Elle ne pose jamais de diagnostic et vous
            oriente vers un professionnel quand il le faut.
          </p>
          <Link href="/chat?voie=sexuelle" className="btn indigo">
            <Icon name="chat" size={18} />
            Parler à Afi
          </Link>
        </div>
      </section>

      <section aria-label="Obstacles" className="wide">
        <h2>Ce qui empêche d'accéder à la contraception, et ce que nous faisons</h2>
        <div className="cards four">
          {barriers.map((barrier) => (
            <div key={barrier.title} className="card plain-card barrier">
              <span className="card-text">
                <strong>{barrier.title}</strong>
                <span>{barrier.text}</span>
              </span>
            </div>
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

      <section aria-label="Autres sujets" className="wide">
        <h2>{ALSO}</h2>
        <div className="cards">
          {(["mentale", "bien-etre"] as const).map((voie) => (
            <Link key={voie} href={`/chat?voie=${voie}`} className={`card tone-${voie}`}>
              <span className="sil-tile">
                <Silhouette voie={voie} size={134} framed={false} />
              </span>
              <span className="card-text">
                <strong>{voie === "mentale" ? "Santé mentale" : "Bien-être"}</strong>
                <em className="who">
                  {PERSONAS[voie].name}, {PERSONAS[voie].role}
                </em>
                <span>{voie === "mentale" ? "Stress, tristesse, parler de ce qui pèse" : "Sommeil, estime de soi, équilibre"}</span>
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
