-- ============================================================
-- 0005 — Invitations dans une organisation + progression des leçons
-- Idempotent : ré-exécutable sans danger.
-- ============================================================

-- 1) handle_new_user : un utilisateur INVITÉ (metadata invited_org, posée par
--    l'invitation admin) rejoint l'organisation de l'invitant avec le rôle
--    donné, au lieu de créer sa propre organisation en admin.
create or replace function handle_new_user() returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
declare
  new_org uuid;
  org_nom text;
  org_slug text;
  invited_org uuid;
  invited_role role_key;
begin
  invited_org := nullif(new.raw_user_meta_data->>'invited_org', '')::uuid;

  if invited_org is not null
     and exists (select 1 from organizations o where o.id = invited_org) then
    invited_role := coalesce(
      nullif(new.raw_user_meta_data->>'invited_role', '')::role_key,
      'apprenant'
    );
    insert into profiles (id, organization_id, role, nom, prenom)
    values (
      new.id,
      invited_org,
      invited_role,
      new.raw_user_meta_data->>'nom',
      new.raw_user_meta_data->>'prenom'
    );
    return new;
  end if;

  -- Inscription classique : organisation dédiée, rôle admin.
  org_nom := coalesce(
    nullif(new.raw_user_meta_data->>'organisation', ''),
    'Organisation de ' || coalesce(new.raw_user_meta_data->>'prenom', split_part(new.email, '@', 1))
  );

  org_slug := lower(regexp_replace(org_nom, '[^a-zA-Z0-9]+', '-', 'g'))
              || '-' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 6);

  insert into organizations (nom, slug)
  values (org_nom, org_slug)
  returning id into new_org;

  insert into profiles (id, organization_id, role, nom, prenom)
  values (
    new.id,
    new_org,
    'admin',
    new.raw_user_meta_data->>'nom',
    new.raw_user_meta_data->>'prenom'
  );

  return new;
end;
$$;

-- 2) Progression des leçons (page cours + dashboard).
create table if not exists lesson_progress (
  user_id uuid not null references profiles(id) on delete cascade,
  lesson_id uuid not null references lessons(id) on delete cascade,
  done_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create index if not exists idx_lesson_progress_user on lesson_progress(user_id);

alter table lesson_progress enable row level security;

drop policy if exists lesson_progress_select_own on lesson_progress;
create policy lesson_progress_select_own on lesson_progress
  for select using (user_id = auth.uid());

drop policy if exists lesson_progress_insert_own on lesson_progress;
create policy lesson_progress_insert_own on lesson_progress
  for insert with check (user_id = auth.uid());

drop policy if exists lesson_progress_delete_own on lesson_progress;
create policy lesson_progress_delete_own on lesson_progress
  for delete using (user_id = auth.uid());
