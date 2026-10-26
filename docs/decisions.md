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

## Services externes
- **Modèle de langage** : DeepSeek (API compatible OpenAI) pour le prototype, Anthropic en alternative. Le choix se
  fait par variables d'environnement (`lib/llm.ts`). Sans clé, le chat répond avec la base seule.
- **Confidentialité** : la question de la personne est envoyée au fournisseur d'IA. Ce service ne la conserve pas, mais
  le fournisseur applique ses propres règles, et son hébergement peut se trouver hors de la zone du projet. Avant un
  pilote avec de vraies personnes, il faut vérifier les conditions du fournisseur au regard des lois sur les données
  personnelles des pays concernés, ou choisir un fournisseur hébergé dans une région acceptable.
- **Lieux (centres de santé, pharmacies)** : `lib/providers.ts` essaie Google Places (clé officielle, carte bancaire
  exigée par Google) s'il est configuré, puis Scrappa (API tierce, 500 crédits gratuits par mois, sans carte). Une
  erreur ou une réponse vide passe à la source suivante, et une source qui donne moins de 5 résultats est complétée
  par la suivante, sans doublons. Il n'y a pas d'autre source : OpenStreetMap a été retiré, sa carte étant trop
  incomplète pour le pilote.
  - Avec une position, la recherche est ancrée dans le pays et la ville du visiteur, déduits de sa connexion par
    l'hébergeur (en-têtes `x-vercel-ip-country` et `x-vercel-ip-city`, voir `lib/geo.ts`) : « centre de santé près de
    Cotonou, Bénin ». Les résultats sont ensuite classés avec la position réelle de l'appareil, et ceux qui sont à plus
    de 100 km sont écartés. Sans repère géographique, on ne cherche pas à l'aveugle.
  - **Ce qui a été essayé et abandonné** : écrire les coordonnées dans le texte de la recherche (« près de
    6.36436,2.41079 ») : Scrappa les traite comme du texte et a renvoyé des centres de France, de Belgique et du
    Danemark. Transformer la position en nom de quartier avec OpenStreetMap : le nom pouvait être faux.
  - **Limites** : le pays est presque toujours juste, la ville l'est moins (réseau mobile, VPN). Une recherche de ville
    ne renvoie qu'un nombre limité de lieux, qui ne sont pas forcément les plus proches ; la distance affichée est
    toujours calculée avec la position réelle.
  - Avec un nom de lieu saisi, le pays est ajouté (« centre de santé près de <lieu>, Bénin ») ; s'il y a moins de 5
    résultats, une seconde recherche élargit à la ville (1 crédit de plus).
  - L'écran affiche la précision de la position donnée par l'appareil et avertit au-delà de 1,5 km : sur ordinateur,
    la position vient souvent du Wi-Fi ou de l'opérateur et peut être très approximative.
  - Le point d'accès « advanced-search » de Scrappa accepte des coordonnées et un niveau de zoom : c'est la solution
    fiable, dès que ses paramètres seront confirmés.
  - Un budget mensuel (`SCRAPPA_MONTHLY_BUDGET`) et un cache de 24 h limitent la dépense. Le compteur est en mémoire :
    il est indicatif et repart à zéro au redémarrage.
- **Confidentialité des lieux** : la position est envoyée à Scrappa, un fournisseur tiers qui tire ses données de Google
  Maps par extraction. Elle n'est ni enregistrée ni journalisée par ce service. La fiabilité et les conditions d'usage de
  Scrappa ne sont pas garanties : à revoir avant un pilote.
- Les résultats ne garantissent pas que le lieu propose le service attendu.

## Bibliothèque des centres du Partenariat de Ouagadougou (à venir)
- Les centres partenaires actuels (`data/structures.json`) sont des emplacements à confirmer. Aucun centre ne doit
  être présenté comme « en collaboration avec le Partenariat de Ouagadougou » sans confirmation écrite.
- Prévu : un champ de réseau sur chaque structure (par exemple `reseaux: ["partenariat-ouagadougou"]`), un pays, des
  services, et des filtres par pays, commune, service et réseau, avec une date de vérification.
- À fournir par les partenaires : la liste confirmée des centres, le critère de « collaboration » et la personne qui
  valide les mises à jour.
