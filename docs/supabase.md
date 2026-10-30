# Brancher Supabase (10 minutes)

Alviosa stocke dans **une seule table** (`alviosa_rows`) : événements d'usage anonymes, services inscrits, avis anonymes, signaux de stock, bilans de prestataires.
Aucun message, aucun nom, aucune adresse IP n'y est écrit.

## 1. Créer le projet
1. Sur supabase.com, créer un projet. Choisir la région la plus proche des utilisateurs (pour l'Afrique de l'Ouest : une région européenne est un bon compromis).
2. Noter le mot de passe de la base dans un gestionnaire de mots de passe. Alviosa ne l'utilise pas.

## 2. Créer la table
Dans **SQL Editor**, coller le contenu de `docs/schema.sql` puis exécuter. La sécurité par ligne (RLS) est activée **sans aucune politique** : avec la clé publique, rien n'est lisible.

## 3. Variables d'environnement (Vercel → Settings → Environment Variables)
| Nom | Valeur | Où la trouver |
|---|---|---|
| `SUPABASE_URL` | `https://xxxx.supabase.co` | Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | clé `service_role` | Project Settings → API → Project API keys |
| `PARTNER_TOKEN` | un long jeton secret | à inventer (32 signes au moins) ; partagé avec les responsables de district |
| `NEXT_PUBLIC_SITE_URL` | `https://votre-domaine` | pour les cartes QR, le sitemap et le partage |

La clé `service_role` ne doit **jamais** être exposée au navigateur : elle n'est lue que côté serveur (`lib/store.ts`). Ne pas la préfixer par `NEXT_PUBLIC_`.

## 4. Vérifier
Redéployer, puis ouvrir `/api/health` : on doit lire `"storage": { "kind": "supabase", "ok": true, "durable": true }`.
Dans `/pilotage` (jeton), le bandeau « Stockage temporaire » disparaît.

## 5. Bonnes pratiques
- **Sauvegardes** : activer les sauvegardes quotidiennes de Supabase.
- **Durée de conservation** : les événements anonymes n'ont pas besoin d'être gardés plus de 24 mois. Planifier (pg_cron) :
  `delete from alviosa_rows where tbl = 'events' and at < now() - interval '24 months';`
- **Accès** : limiter les membres du projet Supabase aux personnes qui en ont besoin.
- **Cadre légal** : vérifier les règles de protection des données du pays (au Bénin, le Code du numérique) avant le pilote. Les données sont anonymes par conception, mais les avis et les inscriptions de services doivent être couverts par un avis de confidentialité.

## Ce qui passe par Supabase
| Donnée | Table logique | Contenu |
|---|---|---|
| Événements d'usage | `events` | nom de l'événement, thème, zone facultative, fiche trouvée ou non, service d'un QR |
| Services | `services` | nom, type, zone, méthodes, déclarations, empreinte du jeton (jamais le jeton) |
| Avis | `reviews` | réponses oui/non, aucune identité |
| Ruptures | `stock` | service, méthode, état |
| Bilans | `bilans` | comptes de qualité du conseil d'un prestataire, zone facultative |

## Comptes (prestataires et responsables)

Les prestataires créent un compte avec e-mail et mot de passe (page « Mon service »). Les responsables (ministère, district, partenaires) ont un compte avec le rôle `pilotage`.

1. Dans Supabase : Authentication, Providers, activer **Email**.
2. Ajouter la variable `SUPABASE_ANON_KEY` (clé « anon » ou « publishable » du projet) dans l'hébergeur, à côté de `SUPABASE_URL`.
3. Authentication, Settings : mettre la durée du jeton (JWT expiry) à 604800 secondes (7 jours) pour que les prestataires ne se reconnectent pas toutes les heures.
4. Décider si la confirmation par e-mail est obligatoire. Si oui, le site affiche « confirme ton adresse ».
5. Donner le rôle Pilotage à une personne, dans l'éditeur SQL :

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"pilotage"}'::jsonb
where email = 'responsable@exemple.org';
```

Le rôle est lu dans `app_metadata`, que la personne ne peut pas modifier elle-même. Sans `SUPABASE_ANON_KEY`, les comptes sont désactivés : l'ancien accès par jeton continue de marcher.

### Pages de compte et mot de passe oublié

- Page de connexion et d'inscription : `/connexion`. Après connexion, un prestataire arrive sur « Mon service », un responsable sur Pilotage.
- « Mot de passe oublié » envoie un lien par e-mail vers `/connexion/nouveau-mot-de-passe`. Dans Supabase, Authentication, URL Configuration :
  - **Site URL** : l'adresse du site (par exemple `https://ton-site.vercel.app`).
  - **Redirect URLs** : ajouter `https://ton-site.vercel.app/connexion/nouveau-mot-de-passe`.
- Sans cette adresse dans la liste, le lien de l'e-mail ne revient pas sur le site.
