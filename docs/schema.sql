-- Stockage de la plateforme Alviosa (Supabase). Une seule table, aucune donnée personnelle.
-- Contenu : événements d'usage (noms seulement), services inscrits, avis anonymes, signaux de stock, bilans de prestataires (comptes),
-- bons de visite (code court + motif, sans nom ni contact).
-- La clé « service_role » reste côté serveur. Aucune politique publique : la table n'est lisible que par le serveur.
-- À exécuter une fois dans l'éditeur SQL de Supabase. Sans danger si la table existe déjà.

create extension if not exists "pgcrypto";

create table if not exists alviosa_rows (
  id uuid primary key default gen_random_uuid(),
  tbl text not null,
  data jsonb not null,
  at timestamptz not null default now()
);

-- Anciennes versions : la liste fermée des tables est retirée (le code décide des tables). Sans effet si absente.
alter table alviosa_rows drop constraint if exists alviosa_rows_tbl_check;

create index if not exists alviosa_rows_tbl_at on alviosa_rows (tbl, at);

-- Retrouver vite un bon de visite et les événements d'un service.
create index if not exists alviosa_rows_event_code on alviosa_rows ((data ->> 'code')) where tbl = 'events';
create index if not exists alviosa_rows_event_service on alviosa_rows ((data ->> 'service')) where tbl = 'events';
create index if not exists alviosa_rows_service_owner on alviosa_rows ((data ->> 'ownerId')) where tbl = 'services';

alter table alviosa_rows enable row level security;
-- Pas de « create policy » : avec la clé anonyme, rien n'est accessible. Seule la clé service_role passe.
