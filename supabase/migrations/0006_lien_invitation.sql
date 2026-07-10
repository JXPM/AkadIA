-- ============================================================
-- 0006 — Lien d'invitation partageable par organisation
-- Un code unique par organisation : toute inscription passée par
-- /invitation/<code> rejoint l'organisation en apprenant.
-- Idempotent : ré-exécutable sans danger.
-- ============================================================

alter table organizations
  add column if not exists invite_code text unique
  default encode(gen_random_bytes(6), 'hex');

-- Code pour les organisations existantes.
update organizations
  set invite_code = encode(gen_random_bytes(6), 'hex')
  where invite_code is null;

create index if not exists idx_organizations_invite_code on organizations(invite_code);
