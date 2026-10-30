# Alviosa

Plateforme de **planification familiale** pour l'Afrique de l'Ouest francophone, en trois espaces qui partagent le même socle :

| Espace | Pour qui | Adresse | Ce qu'on y fait |
|---|---|---|---|
| **Alviosa Jeunes** | Jeunes de 15 à 35 ans | `/` | Comprendre, choisir, préparer sa visite, trouver un service. Sans compte, sans jugement, hors connexion. |
| **Alviosa Prestataires** | Agents de santé, sages-femmes, pharmaciens | `/prestataires` | Consultation guidée (guide OMS), entraînement par jeux de rôle, aide-mémoire, inscription du service, bilan anonyme, assistant. |
| **Alviosa Pilotage** | Districts, ministères, partenaires | `/pilotage` | Tableau de bord anonyme : questions des jeunes, qualité du conseil, services et ruptures, alertes, export. Démonstration publique : `/pilotage/demo`. |

La porte d'entrée est `/all`. Le fil qui relie les trois espaces est l'**annuaire des services** (`/orientation`) : les services s'inscrivent, un
responsable les valide, les jeunes les trouvent et donnent un avis anonyme, les prestataires signalent les ruptures, les décideurs voient les chiffres.

Le contenu médical est un brouillon à faire relire par des professionnels de santé avant tout usage auprès de personnes réelles.
Les documents de référence et les choix de conception sont dans `docs/` (`alignement-po.md`, `decisions.md`).

## Principes
- **Anonymat** : aucun message, aucun nom. Le tableau de bord ne montre que des comptes ; toute valeur sur moins de 5 observations est masquée.
- **Sécurité avant l'IA** : urgences, violences, détresse et demandes de diagnostic ne passent jamais par le modèle.
- **Hors connexion** : après la première visite, les pages, les outils et une version courte d'Afi marchent sans internet.
- **Appropriation par pays** : `lib/pays.ts` porte la configuration (zones, numéros officiels, protocole national, relecture clinique). Rien n'y est inventé.

## Lancer
```
npm install
npm run dev        # http://localhost:3000
npm test           # tests de logique (node:test)
npm run typecheck
```
Variables d'environnement : voir `.env.example` (modèle de langage, lieux, jeton `PARTNER_TOKEN` pour le Pilotage, stockage Supabase).

## Stockage
Sans configuration, les événements, services, avis, bilans et ruptures sont en **mémoire** (ils disparaissent au redémarrage). Pour les garder :
créer un projet Supabase, exécuter `docs/schema.sql`, puis définir `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`.

## Ce qui n'est pas fait
- Contenu validé par des cliniciens, protocole national, numéros d'urgence et lignes d'écoute par pays, annuaire réel.
- Langues locales, WhatsApp et appel vocal (comptes d'opérateur nécessaires).
- Correspondance des codes d'export `ALV_*` avec les éléments de données du système d'information sanitaire d'un pays (par exemple DHIS2).
- Test avec de vrais jeunes et de vrais prestataires.
