import type { Metadata } from "next";
import Link from "next/link";
import Crumbs from "@/components/Crumbs";
import Icon from "@/components/Icon";
import methodesData from "@/data/methodes.json";

export const metadata: Metadata = { title: "Les méthodes" };

type Methode = {
  id: string;
  nom: string;
  niveau: number;
  niveau_label: string;
  page: number;
  ist: boolean;
  ou_aller: string;
  resume: string[];
  ce_que_cest: string[];
  comment: string[];
  peut_arriver: string[];
  a_retenir: string[];
  mode_emploi: string[];
  source: string;
};

const methodes = methodesData as Methode[];
const ORDER = [1, 2, 3, 4, 0];

const QUESTIONS = [
  "As-tu des enfants ? Veux-tu avoir (d'autres) enfants ?",
  "Veux-tu éviter une grossesse maintenant ?",
  "Utilises-tu une méthode actuellement ? En as-tu déjà utilisé une ?",
  "Y a-t-il une méthode que tu souhaiterais utiliser ? Qu'est-ce qui te plaît dans cette méthode ?",
  "Allaites-tu un nourrisson de moins de 6 mois ?",
  "Préfères-tu que ton partenaire ou tes parents ne sachent pas que tu utilises une méthode ?",
  "As-tu parlé de planification familiale avec ton partenaire ?",
  "As-tu des inquiétudes vis-à-vis des IST ou du VIH/sida ?",
  "As-tu des problèmes de santé ?",
];

function Block({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div className="m-block">
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function MethodesPage() {
  return (
    <>
      <Crumbs current="Méthodes" />
      <header>
        <p className="eyebrow">Planification familiale</p>
        <h1>Les méthodes</h1>
        <p className="lede">
          Il existe de nombreuses méthodes. Tu peux en choisir une qui te convient. Certaines sont plus efficaces que d'autres,
          certaines sont plus faciles à utiliser.
        </p>
      </header>

      <section className="panel why">
        <h2>Pourquoi utiliser la planification familiale ?</h2>
        <p>
          <strong>Tu as le droit de choisir combien d'enfants tu auras et quand tu les auras.</strong>
        </p>
        <ul className="plain">
          <li>La mère et les enfants sont en meilleure santé lorsque les grossesses à risque sont évitées.</li>
          <li>Les familles qui ont peu d'enfants ont plus d'argent et de nourriture pour chaque enfant.</li>
          <li>Si les jeunes filles retardent leur grossesse, elles peuvent rester scolarisées.</li>
          <li>Après un enfant, il est plus sain d'attendre au moins 2 ans avant d'en avoir un autre.</li>
        </ul>
      </section>

      <p className="notice important">
        <Icon name="shield" size={18} />
        <span>
          <strong>Important !</strong> Seuls les préservatifs protègent à la fois de la grossesse et des IST, dont le VIH/sida.
        </span>
      </p>

      {ORDER.map((niveau) => {
        const list = methodes.filter((m) => m.niveau === niveau);
        if (list.length === 0) return null;
        return (
          <section key={niveau} aria-label={list[0].niveau_label} className="tier">
            <h2 className={`tier-title tier-${niveau}`}>{list[0].niveau_label}</h2>
            <div className="methods">
              {list.map((m) => (
                <details key={m.id} className="panel method" id={m.id}>
                  <summary>
                    <span className="method-name">{m.nom}</span>
                    {m.ist && <span className="tag vert">Protège aussi des IST</span>}
                  </summary>
                  <ul className="m-resume">
                    {m.resume.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <Block title="Ce que c'est" items={m.ce_que_cest} />
                  <Block title="Comment l'utiliser" items={m.comment} />
                  <Block title="Ce qui peut arriver" items={m.peut_arriver} />
                  <Block title="À retenir" items={m.a_retenir} />
                  {m.mode_emploi.length > 0 && (
                    <div className="m-block">
                      <h4>Mode d'emploi</h4>
                      <ol>
                        {m.mode_emploi.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                  <p className="m-where">
                    <strong>Où aller : </strong>
                    {m.ou_aller}.{" "}
                    <Link href="/orientation">Trouver un centre</Link>
                  </p>
                  <div className="row">
                    <Link className="chip-btn" href="/chat?voie=sexuelle">
                      <Icon name="chat" size={18} />
                      Poser une question
                    </Link>
                  </div>
                  <p className="muted m-source">Source : {m.source}, p. {m.page}</p>
                </details>
              ))}
            </div>
          </section>
        );
      })}

      <section className="panel">
        <h2>Pour t'aider à choisir</h2>
        <p className="muted">Réfléchis à ces questions, et parles-en à un professionnel de santé :</p>
        <ul className="plain">
          {QUESTIONS.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
      </section>

      <p className="notice">
        <Icon name="shield" size={18} />
        <span>
          Contenu établi à partir du Guide de la planification familiale de l'OMS (2012), en cours de validation par des
          professionnels de santé. Ce que propose chaque service peut varier : demande sur place.
        </span>
      </p>
      <Link className="btn indigo" href="/orientation">
        <Icon name="pin" size={18} />
        Trouver un centre près de moi
      </Link>
    </>
  );
}
