# Décisions et limites

## Sécurité
- Les urgences et les demandes de diagnostic sont traitées avant le modèle, par des règles fixes (`lib/safety.ts`).
  La réponse est toujours la même et relue. Les règles sont testées avec `evals/`.
- Les règles sont des motifs de texte. Elles ne remplacent pas une évaluation clinique et peuvent rater une
  formulation inhabituelle. Elles doivent être complétées avec des professionnels et des phrases réelles.
- Le modèle ne reçoit que les extraits de la base et une consigne de ne pas diagnostiquer.

## Données
- Aucun message n'est enregistré. Les compteurs gardent le type d'événement et le thème, jamais le texte.
- La progression est stockée dans le navigateur (`localStorage`). Elle n'est pas envoyée au serveur.

## Engagement
- Les points, badges et séries récompensent des actions utiles : poser une question, lire, préparer une visite.
- Aucune notification, aucune pénalité en cas d'absence, aucun chronomètre.

## Limites connues
- La recherche dans la base est lexicale. Elle sera remplacée par une recherche vectorielle.
- La limite de débit est en mémoire : elle ne tient pas sur plusieurs instances.
- La lecture à voix haute et la dictée dépendent du navigateur et de la langue installée.

## Trois voies, un moteur
- Santé sexuelle, santé mentale et bien-être partagent le même code. Chaque entrée de `data/` porte une `voie`
  (`sexuelle`, `mentale`, `bien-etre` ou `commun`), et la recherche peut être limitée à une voie.
- Le tri de sécurité s'applique à toutes les voies, avant le modèle : urgences, détresse psychique, diagnostic.

## Santé mentale : limites
- Le service informe et oriente. Il ne fait ni thérapie ni suivi, et il le dit.
- Une détresse (idées de mort, automutilation) reçoit une réponse fixe vers une ligne d'écoute et les urgences.
  Le numéro de la ligne d'écoute est un emplacement à renseigner par pays.
- Les motifs de détection sont une première version. Ils peuvent rater des formulations et doivent être complétés
  et testés avec des professionnels avant toute diffusion.
- Le contenu de cette voie doit être relu par un psychologue ou un psychiatre avant d'être montré publiquement.
