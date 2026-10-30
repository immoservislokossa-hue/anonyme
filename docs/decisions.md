# Décisions et limites

## Public cible
- **15 à 24 ans**, filles et garçons (définition `TARGET_AGE` dans `lib/brand.ts`, affichée sur la page d'accueil).
- 13 et 14 ans : le corps, les règles et à qui parler. Pas de conseil de méthode : renvoi vers un adulte de confiance ou un professionnel.
- Plus de 24 ans : bienvenus, mais ce n'est pas la cible.
- À vérifier avant toute affirmation sur les mineurs : l'âge légal de consentement et d'accès à la contraception dans chaque pays.

## Outils tirés du guide OMS
Quatre outils interactifs, dont les règles viennent du Guide de la planification familiale de l'OMS (2012), page par page.
Chaque règle est écrite dans `lib/tools/` et testée dans `tests/tools.test.ts`.
- **Choisir ma méthode** (`chooser.ts`) : p. 3 (méthodes et lieux), p. 6 (injectables), p. 11-14, p. 17 (après un accouchement), p. 18 (définitif et jeunes), p. 19 (dix problèmes de santé). Les méthodes que le guide ne détaille pas pour un problème de santé (implants, stérilet, stérilisation, vasectomie) sont toujours « à confirmer avec un professionnel ».
- **Puis-je commencer aujourd'hui ?** (`pregnancy.ts`) : liste de contrôle de la p. 20 (un seul « oui » suffit, des signes de grossesse l'emportent).
- **Mon cycle** (`cycle.ts`) : méthode des jours fixes, p. 14 et 26 (jours fertiles 8 à 19, cycle de 26 à 32 jours). Export calendrier (.ics) sans donnée personnelle. La date n'est mémorisée que si la personne le demande, sur son appareil.
- **J'ai un souci avec ma méthode** : fiches de chaque méthode (oubli, retard, effets) et liste de contrôle des clients de retour (p. 28).
- **Après un rapport à risque** (`risk.ts`) : pilule d'urgence jusqu'à 5 jours (p. 16), violence (p. 18), oubli de pilule et injection en retard (p. 4, 6), traitement d'urgence du VIH dans les 72 heures (recommandation OMS, hors guide). Le test de grossesse « après une semaine de retard de règles » est une consigne courante, à valider.
- **Mon plan et mes rappels** (`plan.ts`) : injections (DMPA 13 semaines, retard toléré 4 semaines ; NET-EN 8 semaines, 2 semaines), pilule, stérilet (12 ans), implants (3 à 5 ans), vasectomie (3 mois). Le plan reste dans `localStorage`. Le fichier calendrier peut ne dire que « Rappel santé » pour rester discret.
- **Sortie rapide** : bouton « Quitter vite » et deux fois Échap, de n'importe quelle page, pour quitter le site sans trace dans l'historique de retour.
- Limites : le guide date de 2012 et s'appuie sur les critères de recevabilité de 2010 de l'OMS. Les outils doivent être relus par un professionnel et mis à jour avec les recommandations nationales avant le pilote. Ils orientent, ils ne prescrivent pas.

## Sécurité
- Les urgences et les demandes de diagnostic sont traitées avant le modèle, par des règles fixes (`lib/safety.ts`).
  La réponse est toujours la même et relue. Les règles sont testées avec `evals/`.
- Les règles sont des motifs de texte. Elles ne remplacent pas une évaluation clinique et peuvent rater une
  formulation inhabituelle. Elles doivent être complétées avec des professionnels et des phrases réelles.
- Le modèle ne reçoit que les extraits de la base et une consigne de ne pas diagnostiquer.

## Données
- Aucun message n'est enregistré. Les compteurs gardent le type d'événement et le thème, jamais le texte.
- Usage des outils : `POST /api/event` n'accepte que des noms connus (`lib/metrics.ts`), une fois par visite et par événement, sans identifiant. Chaque événement est aussi écrit en JSON sur la sortie du serveur, où l'hébergeur le conserve, pour compter dans la durée avant d'avoir une base.
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

## Sources du contenu sur la planification familiale

- Base : *Guide de la planification familiale à l'usage des agents de santé communautaires et de leurs clients*, OMS (2012), adapté de l'*Outil d'aide à la prise de décision* de l'OMS. Complément (fausses croyances, anatomie) : *Guide fondamental de la contraception*, Govern de les Illes Balears (2009).
- Les fiches « Les méthodes », la base de réponses de l'assistante et les aide-mémoire de l'espace pro reprennent le plan du guide (ce que c'est, comment l'utiliser, ce qui peut arriver, à retenir, où aller), ses chiffres et ses mots, avec la page d'origine. Le tutoiement remplace le vouvoiement du guide, pour s'adresser à des personnes de 12 à 25 ans.
- Nous disons « s'appuie sur », jamais « validé par l'OMS ». Aucun contenu n'est présenté comme validé tant qu'un professionnel de santé du pays ne l'a pas relu.
- **Droits** : l'OMS demande une autorisation pour reproduire ou traduire ses publications (formulaire de licence sur who.int). À obtenir avant un lancement public. Ne pas reproduire leurs illustrations ; les nôtres sont dessinées pour ce projet. Même démarche pour le guide des Baléares.
- Le guide des Baléares décrit des méthodes peu disponibles en Afrique de l'Ouest (anneau, patch, diaphragme) : elles ne sont pas reprises. Là où les deux guides divergent (méthodes naturelles, allaitement), nous suivons l'OMS en précisant les conditions.

## 30 octobre 2026 : refonte guidée par les données du PO

- Deux outils ajoutés (« Je prépare ma visite », « Parler à quelqu'un ») et un sujet (« Attendre ou espacer »), chacun relié à une donnée publique (voir `docs/alignement-po.md`).
- Page publique `/a-propos` : données, choix de conception, limites, indicateurs, sources.
- Mesure : deux événements « avis oui/non » sans texte, un statut « prêt sans connexion » visible dans Aide et sur l'accueil.
- Principe : toute statistique citée dans l'application dit sa source, son pays et son année ; une opinion n'est pas présentée comme un usage.

## 30 octobre 2026 : simplification de l'interface

- Public : on garde 15-24 ans, comme la stratégie jeunes du PO et l'appel du Prix (15-19 ans cités). Les données d'opinion disponibles couvrent les adultes 18+ (jeunes = 18-35 ans chez Afrobaromètre). Le pilote de test se fait avec des 18-24 ans.
- Accueil : une question (« Où en es-tu ? »), quatre situations, trois liens secondaires. Retrait des avatars, de la pastille d'âge, des boutons de canaux « Bientôt » et du statut hors-ligne (resté dans Aide).
- Pages Apprendre, Outils, Sujets : lignes compactes, outils rangés en trois moments (avant le centre, après un risque, au quotidien).
- Pages d'outil : l'outil s'affiche tout de suite ; « Comment ça marche » et « Ce qu'il ne fait pas » sont repliés.
- Pages méthode : « Qui ne peut pas la prendre » et « Après un accouchement » repliés.
- Afi : ton non infantilisant (15 mots par phrase), aucune supposition sur le sexe ou le statut, une seule prochaine étape (outil) proposée, prudence sur la loi (« dépend du pays et du centre »).
