// Ce que fait le service des informations de la personne, en mots simples.
export default function PrivacyInfo() {
  return (
    <>
      <section className="panel">
        <h3>En clair</h3>
        <ul className="plain">
          <li>Tu n'as pas besoin de donner ton nom, ton numéro ou ton adresse.</li>
          <li>Nous ne gardons pas tes messages. Pour préparer une réponse, ta question est envoyée à un fournisseur d'intelligence artificielle externe, qui a ses propres règles. N'écris ni ton nom ni tes coordonnées.</li>
          <li>Si tu cherches un centre ou une pharmacie, ton pays et ta ville approximatifs (déduits de ta connexion) sont envoyés à un fournisseur de cartes (Google Maps via Scrappa) pour trouver les lieux. Ta position exacte reste sur ton téléphone, qui s'en sert pour calculer les distances. Rien n'est enregistré, et tu peux écrire un nom de commune à la place.</li>
          <li>Tes points et les histoires que tu as terminées restent sur ton téléphone.</li>
          <li>Nous comptons seulement le nombre de questions par thème, sans savoir qui les a posées.</li>
          <li>Ce service est automatisé. Il ne remplace jamais un professionnel de santé.</li>
        </ul>
      </section>

      <section className="panel">
        <h3>Pour effacer ta progression</h3>
        <p>
          Efface les données de ce site dans les réglages de ton navigateur. Ta progression disparaît de ton
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
