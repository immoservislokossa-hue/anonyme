# Alviosa

Prototype d'un service d'information et d'orientation en **santé sexuelle**, **santé mentale** et **bien-être**
pour l'Afrique de l'Ouest. Un seul moteur, trois voies. Le nom se change dans `lib/brand.ts`.

Ce dépôt est un prototype. Le contenu médical est un brouillon qui doit être validé par des professionnels de
santé avant tout usage auprès de personnes réelles. Le volet santé mentale se limite à l'information et à
l'orientation : le service ne fait ni thérapie ni suivi.

## Un moteur, trois voies

| Voie | Contenu | Règles propres |
|---|---|---|
| Santé sexuelle | Contraception, infections, consentement, urgence après un risque, violences, grossesse | Urgences orientées vers un centre sans passer par le modèle |
| Santé mentale | Stress, tristesse, honte, quand se sentir très mal | Détresse (idées de mort, automutilation) : réponse fixe vers une ligne d'écoute et les urgences |
| Bien-être | Sommeil, estime de soi, routine, respiration | Conseils du quotidien, jamais de traitement |

Le moteur est commun : tri de sécurité avant le modèle, recherche dans la base, orientation vers un centre, histoires,
chroniques, progression sur l'appareil et suivi agrégé. Chaque voie ajoute son contenu (`data/`), ses cas de test
(`evals/`) et ses consignes (`lib/prompt.ts`). Pour un autre sujet, on change `lib/domain.ts` et le contenu.

Le même prototype peut donc être présenté à différents prix en mettant en avant la voie qui correspond à chacun.

## Ce qui fonctionne

| Parcours | Page | État |
|---|---|---|
| Poser une question | `/chat` (et `/chat?voie=…`) | Tri de sécurité, recherche dans la base, réponse de Claude si une clé est fournie, réponse tirée de la base sinon. Dictée vocale et lecture à voix haute selon le navigateur. |
| Urgence | `/urgence` | Page statique. Les messages urgents ou de détresse du chat ne passent jamais par le modèle. |
| Chroniques | `/chroniques` | Textes lus à voix haute par la voix du téléphone. Pas d'enregistrements audio. |
| Trouver un centre ou une pharmacie | `/orientation` | Recherche de centres de santé et de pharmacies autour de la position (ou d'un nom de lieu), avec itinéraire. Sources : Scrappa (Google Maps, 500 recherches gratuites par mois, sans carte bancaire) ou Google Maps (clé officielle). Sans clé, la page renvoie vers les centres partenaires. Filtre des centres partenaires par commune et préparation de la visite. Les cinq centres partenaires sont des emplacements à remplir. |
| Espace agent | `/pro` | Listes de vérification avec source, version et statut de validation. |
| Suivi | `/partenaires` | Compteurs agrégés, protégés par `PARTNER_TOKEN`. |
| Confidentialité, aide | `/consentement`, `/aide` | Pages d'information. |

La progression (points, badges, série) est stockée sur l'appareil. Aucun message n'est conservé.

## Ce qui n'est pas fait

- Bibliothèque des centres en collaboration avec le Partenariat de Ouagadougou, avec filtres (voir `docs/decisions.md`).
- WhatsApp, appel vocal et rappel téléphonique : il faut des comptes chez un opérateur ou un fournisseur.
- Langues locales : le prototype est en français uniquement.
- Stockage durable des compteurs : ils sont en mémoire et repartent à zéro au redémarrage.
- Contenu validé, vraies structures partenaires, numéro d'urgence et ligne d'écoute par pays : à fournir avec les
  partenaires.
- Santé mentale : le contenu et les règles de crise doivent être relus par un psychologue ou un psychiatre avant
  toute présentation publique.

## Lancer

```bash
npm install
cp .env.example .env.local   # renseigner DEEPSEEK_API_KEY (ou ANTHROPIC_API_KEY), SCRAPPA_API_KEY (ou GOOGLE_MAPS_API_KEY) et PARTNER_TOKEN
npm run dev
```

Sans clé de modèle, le chat répond avec la base de connaissances. Sans clé de lieux, la recherche autour de moi indique qu'elle n'est pas activée et renvoie vers les centres partenaires.

## Vérifier

```bash
npm run typecheck
npm test
npm run build
```

Les tests couvrent le tri de sécurité (`evals/*.jsonl`), la progression, la limite de débit et la recherche par voie.

## Structure

```
app/            pages et routes API (chat, health)
components/     chat, histoires, chroniques, progression, voix, choix de la voie
lib/            domaine et voies, sécurité, recherche, progression, limite de débit, marque
data/           base de connaissances, méthodes, chroniques, protocoles, structures
evals/          cas de référence : urgences, crise, diagnostic, questions normales
tests/          tests unitaires
docs/           décisions et limites
```

## Avant un pilote

1. Faire relire tous les contenus de `data/` par des professionnels (santé sexuelle, et psychologue pour la voie
   santé mentale) et renseigner `source` et `dateVersion`.
2. Remplacer `data/structures.json` par les centres confirmés, avec date de vérification.
3. Renseigner le numéro d'urgence et la ligne d'écoute de chaque pays (`lib/brand.ts`).
4. Relire `/consentement` avec les partenaires et la loi nationale sur les données personnelles.
5. Brancher un stockage durable pour les compteurs (une table d'événements sans données personnelles).
6. Définir qui répond aux personnes orientées vers un humain, et à quelles heures.
