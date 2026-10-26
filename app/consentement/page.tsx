import type { Metadata } from "next";
import { APP_NAME } from "@/lib/brand";

export const metadata: Metadata = { title: "Confidentialité" };

export default function ConsentPage() {
  return (
    <>
      <header>
        <p className="eyebrow">Confidentialité</p>
        <h1>Ce que fait {APP_NAME} de vos informations</h1>
      </header>

      <section className="panel">
        <h2>En clair</h2>
        <ul className="plain">
          <li>Vous n'avez pas besoin de donner votre nom, votre numéro ou votre adresse.</li>
          <li>Nous ne conservons pas vos messages. Pour préparer une réponse, votre question est envoyée à un fournisseur d'intelligence artificielle externe, qui applique ses propres règles. N'écrivez ni votre nom ni vos coordonnées.</li>
          <li>Si vous cherchez un centre ou une pharmacie, votre position ou le nom de lieu que vous écrivez est envoyé à un service de cartes (OpenStreetMap, ou Google Maps via un fournisseur). Elle n'est pas enregistrée par ce service, et vous pouvez écrire un nom de commune à la place.</li>
          <li>Vos points, badges et réponses au quiz restent sur votre téléphone.</li>
          <li>Nous comptons seulement le nombre de questions par thème, sans savoir qui les a posées.</li>
          <li>Ce service est automatisé. Il ne remplace jamais un professionnel de santé.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>Pour effacer votre progression</h2>
        <p>
          Effacez les données de ce site dans les réglages de votre navigateur. Votre progression disparaît de votre
          téléphone.
        </p>
      </section>

      <p className="notice">
        Texte provisoire. Il doit être relu avec les partenaires et adapté à la loi sur la protection des données de
        chaque pays avant le pilote.
      </p>
    </>
  );
}
