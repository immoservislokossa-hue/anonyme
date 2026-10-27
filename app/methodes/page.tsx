import type { Metadata } from "next";
import Link from "next/link";
import Icon from "@/components/Icon";
import Crumbs from "@/components/Crumbs";
import methodes from "@/data/methodes.json";

export const metadata: Metadata = { title: "Quelle méthode ?" };

type Methode = (typeof methodes)[number];

export default function MethodesPage() {
  return (
    <>
      <Crumbs current="Méthodes" />
      <header>
        <p className="eyebrow">Planification familiale</p>
        <h1>Les méthodes, en clair</h1>
        <p className="lede">
          Il n'y a pas de méthode idéale pour tout le monde. Voici les principales, avec ce qu'il faut savoir avant d'en parler
          à un professionnel. Cette page informe, elle ne remplace pas une consultation.
        </p>
      </header>

      <div className="methods">
        {(methodes as Methode[]).map((m) => (
          <article key={m.id} className="panel method">
            <div className="method-head">
              <h2>{m.nom}</h2>
              <span className="tag">{m.type}</span>
            </div>
            <p>{m.comment}</p>
            <dl>
              <div>
                <dt>Durée</dt>
                <dd>{m.duree}</dd>
              </div>
              <div>
                <dt>Protège des infections</dt>
                <dd>{m.ist ? "Oui" : "Non"}</dd>
              </div>
              <div>
                <dt>Avec un professionnel</dt>
                <dd>{m.professionnel ? "Oui, pour la pose ou la prescription" : "Pas toujours nécessaire"}</dd>
              </div>
            </dl>
            <p>
              <strong>À savoir : </strong>
              {m.a_savoir}
            </p>
            <p className="muted">
              <strong>À demander : </strong>
              {m.a_discuter}
            </p>
            <Link className="chip-btn" href={`/chat?voie=sexuelle`}>
              <Icon name="chat" size={18} />
              Poser une question sur cette méthode
            </Link>
          </article>
        ))}
      </div>

      <p className="notice">
        <Icon name="shield" size={18} />
        <span>
          Contenu en cours de validation par des professionnels de santé. Chaque situation est différente : un professionnel
          t'aide à choisir.
        </span>
      </p>
      <Link className="btn indigo" href="/orientation">
        <Icon name="pin" size={18} />
        Trouver un centre près de moi
      </Link>
    </>
  );
}
