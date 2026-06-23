-- ============================================================
-- 0002 — Création automatique organisation + profil à l'inscription
-- ============================================================
-- À l'inscription via Supabase Auth, aucune ligne `profiles` n'existe par
-- défaut ; or `current_org()` (RLS multi-tenant) lit `profiles.organization_id`.
-- Ce trigger crée, pour chaque nouvel utilisateur, une organisation dédiée et
-- son profil (rôle `admin` de sa propre organisation). Les métadonnées
-- (prenom, nom, organisation) proviennent de `auth.signUp({ options: { data }})`.

create or replace function handle_new_user() returns trigger
  language plpgsql
  security definer
  set search_path = public
as $$
declare
  new_org uuid;
  org_nom text;
  org_slug text;
begin
  org_nom := coalesce(
    nullif(new.raw_user_meta_data->>'organisation', ''),
    'Organisation de ' || coalesce(new.raw_user_meta_data->>'prenom', split_part(new.email, '@', 1))
  );

  -- slug unique : base lisible + suffixe aléatoire court
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ------------------------------------------------------------
-- Correctif RLS : current_org() / is_admin() lisent `profiles`, et la policy
-- de select sur `profiles` appelle current_org() → récursion infinie sous RLS.
-- En SECURITY DEFINER, ces helpers contournent RLS (lecture du seul profil
-- de l'appelant via auth.uid()). Pattern recommandé Supabase.
-- ------------------------------------------------------------
create or replace function current_org() returns uuid
  language sql stable security definer set search_path = public
as $$
  select organization_id from profiles where id = auth.uid();
$$;

create or replace function is_admin() returns boolean
  language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('super_admin','admin','formateur')
  );
$$;
