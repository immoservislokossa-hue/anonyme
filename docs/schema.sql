-- Stockage de la plateforme Alviosa (Supabase). Une seule table, aucune donnée personnelle.
-- Contenu : événements d'usage (noms seulement), services inscrits, avis anonymes, signaux de stock, bilans de prestataires (comptes).
-- La clé « service_role » reste côté serveur. Aucune politique publique : la table n'est lisible que par le serveur.

create extension if not exists "pgcrypto";

create table if not exists alviosa_rows (
  id uuid primary key default gen_random_uuid(),
  tbl text not null check (tbl in ('events', 'services', 'reviews', 'bilans', 'stock')),
  data jsonb not null,
  at timestamptz not null default now()
);

create index if not exists alviosa_rows_tbl_at on alviosa_rows (tbl, at);

alter table alviosa_rows enable row level security;
-- Pas de « create policy » : avec la clé anonyme, rien n'est accessible. Seule la clé service_role passe.
