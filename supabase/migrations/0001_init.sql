-- ============================================================
-- AKADIA — Schéma initial Supabase (PostgreSQL)
-- Multi-tenant par organization_id + RLS.
-- Réf. wiki/pages/40 - Base de données Supabase.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- ENUMS ----------
create type role_key as enum ('super_admin', 'admin', 'formateur', 'apprenant');
create type difficulte as enum ('debutant', 'intermediaire', 'avance');
create type formation_status as enum ('brouillon', 'publiee', 'archivee');
create type lesson_type as enum (
  'texte','interactive','presentation','pdf','fichier','etude_de_cas','quiz',
  'atelier','challenge','escape_game','simulation','classe_virtuelle','capsule_video','webinaire'
);
create type question_type as enum ('qcm','vrai_faux','glisser_deposer','cas_pratique','reponse_libre');
create type session_mode as enum ('presentiel','virtuelle','hybride');
create type attestation_kind as enum ('suivi','reussite');

-- ---------- TENANTS & IDENTITÉ ----------
create table organizations (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  slug text unique not null,
  logo_url text,
  plan text not null default 'starter',
  created_at timestamptz not null default now()
);

-- Profils liés à auth.users (Supabase Auth)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id) on delete set null,
  role role_key not null default 'apprenant',
  nom text,
  prenom text,
  avatar_url text,
  xp int not null default 0,
  niveau int not null default 1,
  created_at timestamptz not null default now()
);
create index idx_profiles_org on profiles(organization_id);

create table roles (
  id serial primary key,
  key role_key unique not null,
  libelle text not null
);

create table permissions (
  id serial primary key,
  code text unique not null,
  libelle text not null
);

create table role_permissions (
  role_id int references roles(id) on delete cascade,
  permission_id int references permissions(id) on delete cascade,
  primary key (role_id, permission_id)
);

-- ---------- CATALOGUE / CONTENU ----------
create table formations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  titre text not null,
  slug text not null,
  description text,
  image_url text,
  auteur_id uuid references profiles(id) on delete set null,
  categorie text,
  difficulte difficulte not null default 'debutant',
  duree_heures numeric(5,1) default 0,
  tags text[] default '{}',
  objectifs text[] default '{}',
  status formation_status not null default 'brouillon',
  note numeric(2,1) default 0,
  apprenants_count int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);
create index idx_formations_org on formations(organization_id);
create index idx_formations_status on formations(status);
create index idx_formations_cat on formations(categorie);

create table modules (
  id uuid primary key default gen_random_uuid(),
  formation_id uuid not null references formations(id) on delete cascade,
  titre text not null,
  position int not null default 0
);
create index idx_modules_formation on modules(formation_id);

create table chapitres (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules(id) on delete cascade,
  titre text not null,
  position int not null default 0
);
create index idx_chapitres_module on chapitres(module_id);

create table lessons (
  id uuid primary key default gen_random_uuid(),
  chapitre_id uuid not null references chapitres(id) on delete cascade,
  titre text not null,
  type lesson_type not null default 'texte',
  contenu jsonb,
  duree_min int default 0,
  position int not null default 0
);
create index idx_lessons_chapitre on lessons(chapitre_id);

create table videos (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons(id) on delete cascade,
  url text,
  script text,
  sous_titres text,
  duree_sec int,
  genere_par_ia boolean default false,
  created_at timestamptz not null default now()
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons(id) on delete cascade,
  nom text not null,
  url text not null,
  type text,
  taille_ko int
);

-- ---------- ÉVALUATION ----------
create table quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references lessons(id) on delete cascade,
  titre text not null,
  score_min int default 70
);

create table questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  type question_type not null default 'qcm',
  enonce text not null,
  options jsonb,
  reponse jsonb,
  explication text,
  points int default 1,
  position int default 0
);
create index idx_questions_quiz on questions(quiz_id);

create table attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references quizzes(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  reponses jsonb,
  score numeric(5,2),
  reussi boolean default false,
  created_at timestamptz not null default now()
);
create index idx_attempts_user on attempts(user_id);

-- ---------- GAMIFICATION ----------
create table badges (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  nom text not null,
  description text,
  icone text,
  condition text
);

create table achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  badge_id uuid not null references badges(id) on delete cascade,
  obtenu_le timestamptz not null default now(),
  unique (user_id, badge_id)
);

-- ---------- CERTIFICATION ----------
create table certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  formation_id uuid not null references formations(id) on delete cascade,
  pdf_url text,
  qr_code text,
  signature text,
  emis_le timestamptz not null default now()
);

create table attestations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  formation_id uuid not null references formations(id) on delete cascade,
  kind attestation_kind not null,
  score numeric(5,2),
  pdf_url text,
  emis_le timestamptz not null default now()
);

-- ---------- SESSIONS LIVE / GROUPES ----------
create table sessions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  formation_id uuid references formations(id) on delete set null,
  formateur_id uuid references profiles(id) on delete set null,
  titre text not null,
  mode session_mode not null default 'presentiel',
  lien_visio text,
  debut_at timestamptz,
  duree_min int,
  active boolean default false
);
create index idx_sessions_org on sessions(organization_id);

create table groups (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  nom text not null
);

create table group_members (
  group_id uuid references groups(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  primary key (group_id, user_id)
);

-- ---------- LABORATOIRE / PROMPTS ----------
create table prompt_library (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  titre text not null,
  domaine text,
  niveau difficulte default 'debutant',
  contenu text not null,
  favori boolean default false,
  created_at timestamptz not null default now()
);

create table prompt_tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  prompt text not null,
  score int,
  axes jsonb,
  optimized text,
  created_at timestamptz not null default now()
);
create index idx_prompt_tests_user on prompt_tests(user_id);

-- ---------- ANALYTICS / NOTIFS ----------
create table analytics (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  formation_id uuid references formations(id) on delete cascade,
  metric text not null,
  valeur numeric,
  meta jsonb,
  created_at timestamptz not null default now()
);
create index idx_analytics_org on analytics(organization_id);
create index idx_analytics_metric on analytics(metric);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  titre text not null,
  corps text,
  lu boolean default false,
  created_at timestamptz not null default now()
);
create index idx_notifications_user on notifications(user_id);

-- ---------- ACCÈS AUX FORMATIONS ----------
-- Pas de vente à l'unité : c'est l'académie (super_admin) qui ouvre l'accès
-- d'une organisation cliente à une formation, pour une période définie.
create table acces_formations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  formation_id uuid not null references formations(id) on delete cascade,
  date_debut date not null default current_date,
  date_fin date,                       -- null = sans échéance
  actif boolean not null default true,
  note text,                           -- contexte interne (ex. nom du contrat)
  created_at timestamptz not null default now(),
  unique (organization_id, formation_id)
);
create index idx_acces_org on acces_formations(organization_id);
create index idx_acces_formation on acces_formations(formation_id);

-- ---------- TRIGGER updated_at ----------
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;
create trigger trg_formations_updated before update on formations
  for each row execute function set_updated_at();

-- ============================================================
-- RLS — isolation multi-tenant
-- ============================================================
create or replace function current_org() returns uuid as $$
  select organization_id from profiles where id = auth.uid();
$$ language sql stable;

create or replace function is_admin() returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('super_admin','admin','formateur')
  );
$$ language sql stable;

-- Activer RLS sur les tables porteuses d'organization_id
alter table organizations   enable row level security;
alter table profiles        enable row level security;
alter table formations      enable row level security;
alter table sessions        enable row level security;
alter table prompt_library  enable row level security;
alter table analytics       enable row level security;
alter table acces_formations enable row level security;
alter table badges          enable row level security;
alter table notifications   enable row level security;

-- Lecture cloisonnée à l'organisation
create policy org_read on organizations for select using (id = current_org());
create policy profiles_self_org on profiles for select using (organization_id = current_org());
create policy formations_org_read on formations for select using (organization_id = current_org());
create policy sessions_org_read on sessions for select using (organization_id = current_org());
create policy prompts_org_read on prompt_library for select using (organization_id = current_org());
create policy analytics_org_read on analytics for select using (organization_id = current_org());
create policy badges_org_read on badges for select using (organization_id = current_org());

-- Notifications : strictement personnelles
create policy notifications_owner on notifications
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Écriture du catalogue réservée aux admins/formateurs du tenant
create policy formations_admin_write on formations
  for all using (organization_id = current_org() and is_admin())
  with check (organization_id = current_org() and is_admin());

-- Accès aux formations : une organisation lit ses propres accès ;
-- la gestion (octroi/révocation) est réservée aux admins.
create policy acces_org_read on acces_formations
  for select using (organization_id = current_org());
create policy acces_admin_write on acces_formations
  for all using (is_admin()) with check (is_admin());
