-- ============================================================
-- 0004 — Sessions live façon Kahoot
-- Quiz d'organisation (hors leçons), code de session + QR,
-- participants invités (sans compte) et réponses en direct.
-- Idempotent : ré-exécutable sans danger.
-- ============================================================

-- Quiz rattachables à une organisation (créés par un formateur/admin),
-- indépendamment des leçons.
alter table quizzes add column if not exists organization_id uuid references organizations(id) on delete cascade;
alter table quizzes add column if not exists created_by uuid references profiles(id) on delete set null;
create index if not exists idx_quizzes_org on quizzes(organization_id);

-- Sessions live : code de participation + machine à états.
alter table sessions add column if not exists code text unique;
alter table sessions add column if not exists quiz_id uuid references quizzes(id) on delete set null;
alter table sessions add column if not exists etat text not null default 'lobby'; -- lobby | question | resultats | terminee
alter table sessions add column if not exists question_index int not null default -1;
alter table sessions add column if not exists question_started_at timestamptz;
create index if not exists idx_sessions_code on sessions(code);

-- Participants : comptes AKADIA ou invités avec simple pseudo (comme Kahoot).
create table if not exists session_participants (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  pseudo text not null,
  score int not null default 0,
  joined_at timestamptz not null default now(),
  unique (session_id, pseudo)
);
create index if not exists idx_session_participants_session on session_participants(session_id);

-- Réponses en direct (une par participant et par question).
create table if not exists session_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  participant_id uuid not null references session_participants(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  reponse jsonb,
  correcte boolean not null default false,
  points int not null default 0,
  answered_at timestamptz not null default now(),
  unique (participant_id, question_id)
);
create index if not exists idx_session_answers_session on session_answers(session_id);

-- RLS : les invités passent exclusivement par les routes serveur (service
-- role). Les tables restent verrouillées pour anon/authenticated ; seuls les
-- membres de l'organisation peuvent LIRE les sessions de leur organisation.
alter table session_participants enable row level security;
alter table session_answers enable row level security;

drop policy if exists session_participants_select_org on session_participants;
create policy session_participants_select_org on session_participants
  for select using (
    exists (
      select 1 from sessions s
      where s.id = session_participants.session_id
        and s.organization_id = current_org()
    )
  );

drop policy if exists session_answers_select_org on session_answers;
create policy session_answers_select_org on session_answers
  for select using (
    exists (
      select 1 from sessions s
      where s.id = session_answers.session_id
        and s.organization_id = current_org()
    )
  );
