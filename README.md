# Alviosa

Prototype pilote d'un service d'information et d'orientation en planification familiale pour l'Afrique de l'Ouest.
Le nom se change dans `lib/brand.ts`.

Ce dépôt est un prototype. Le contenu médical est un brouillon qui doit être validé par des professionnels de
santé avant tout usage auprès de personnes réelles.

## Ce qui fonctionne

| Parcours | Page | État |
|---|---|---|
| Poser une question | `/chat` | Tri des urgences et des diagnostics, recherche dans la base validée, réponse de Claude si une clé est fournie, réponse tirée de la base sinon. Dictée vocale et lecture à voix haute selon le navigateur. |
| Urgence | `/urgence` | Page statique. Les messages urgents du chat ne passent jamais par le modèle. |
| Vrai ou faux | `/quiz` | Six questions, explications, points. |
| Chroniques | `/chroniques` | Textes lus à voix haute par la voix du téléphone. Pas d'enregistrements audio. |
| Trouver un centre | `/orientation` | Filtre par commune et préparation de la visite. Les cinq centres sont des emplacements à remplir. |
| Espace agent | `/pro` | Listes de vérification avec source, version et statut de validation. |
| Suivi | `/partenaires` | Compteurs agrégés, protégés par `PARTNER_TOKEN`. |
| Confidentialité, aide | `/consentement`, `/aide` | Pages d'information. |

La progression (points, badges, série) est stockée sur l'appareil. Aucun message n'est conservé.

## Ce qui n'est pas fait

- WhatsApp, appel vocal et rappel téléphonique : il faut des comptes chez un opérateur ou un fournisseur.
- Langues locales : le prototype est en français uniquement.
- Stockage durable des compteurs : ils sont en mémoire et repartent à zéro au redémarrage.
- Contenu validé, vraies structures partenaires et numéro d'urgence par pays : à fournir avec les partenaires.

## Lancer

```bash
npm install
cp .env.example .env.local   # renseigner ANTHROPIC_API_KEY et PARTNER_TOKEN
npm run dev
```

Sans `ANTHROPIC_API_KEY`, le chat répond avec la base de connaissances.

## Vérifier

```bash
npm run typecheck
npm test
npm run build
```

Les tests couvrent le tri de sécurité (`evals/*.jsonl`), la progression, la limite de débit et la recherche.

## Structure

```
app/            pages et routes API (chat, health)
components/     chat, quiz, chroniques, progression, voix
lib/            sécurité, recherche, progression, limite de débit, marque
data/           base de connaissances, quiz, chroniques, protocoles, structures
evals/          cas de référence pour le tri de sécurité
tests/          tests unitaires
docs/           décisions et limites
```

## Avant un pilote

1. Faire relire tous les contenus de `data/` par des professionnels et renseigner `source` et `dateVersion`.
2. Remplacer `data/structures.json` par les centres confirmés, avec date de vérification.
3. Renseigner le numéro d'urgence de chaque pays (`lib/brand.ts`).
4. Relire `/consentement` avec les partenaires et la loi nationale sur les données personnelles.
5. Brancher un stockage durable pour les compteurs (une table d'événements sans données personnelles).
6. Définir qui répond aux personnes orientées vers un humain, et à quelles heures.
