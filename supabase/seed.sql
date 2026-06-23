-- ============================================================
-- AKADIA — Données de démonstration
-- À exécuter après 0001_init.sql.
-- ============================================================

-- Rôles & permissions
insert into roles (key, libelle) values
  ('super_admin','Super Administrateur'),
  ('admin','Administrateur'),
  ('formateur','Formateur'),
  ('apprenant','Apprenant')
on conflict do nothing;

insert into permissions (code, libelle) values
  ('formations.manage','Gérer les formations'),
  ('users.manage','Gérer les utilisateurs'),
  ('sessions.run','Animer des sessions'),
  ('analytics.view','Consulter les analytics'),
  ('billing.manage','Gérer la facturation')
on conflict do nothing;

-- Organisation de démo
insert into organizations (id, nom, slug, plan) values
  ('11111111-1111-1111-1111-111111111111','Cabinet Delvaux','cabinet-delvaux','pro')
on conflict do nothing;

-- Formations de démo
insert into formations (id, organization_id, titre, slug, description, categorie, difficulte, duree_heures, prix, tags, objectifs, status, note, apprenants_count)
values
  ('22222222-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111',
   'Maîtriser l''IA Générative en entreprise','maitriser-ia-generative',
   'De zéro à expert : LLM, prompts professionnels et déploiement sécurisé.',
   'IA Générative','intermediaire',12,249,
   array['LLM','Prompt Engineering','RGPD'],
   array['Comprendre les LLM','Rédiger des prompts efficaces','Déployer en conformité RGPD'],
   'publiee',4.8,3240),
  ('22222222-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111',
   'RGPD & Protection des données','rgpd-protection-donnees',
   'Mettez votre organisation en conformité RGPD.',
   'RGPD & Données','debutant',8,179,
   array['RGPD','Conformité','DPO'],
   array['Maîtriser les principes du RGPD','Tenir un registre des traitements'],
   'publiee',4.7,2110)
on conflict do nothing;

-- Modules / chapitres / leçons (formation IA)
insert into modules (id, formation_id, titre, position) values
  ('33333333-0000-0000-0000-000000000001','22222222-0000-0000-0000-000000000001','Fondations de l''IA générative',0)
on conflict do nothing;

insert into chapitres (id, module_id, titre, position) values
  ('44444444-0000-0000-0000-000000000001','33333333-0000-0000-0000-000000000001','Comprendre les LLM',0)
on conflict do nothing;

insert into lessons (id, chapitre_id, titre, type, duree_min, position) values
  ('55555555-0000-0000-0000-000000000001','44444444-0000-0000-0000-000000000001','Qu''est-ce qu''un LLM ?','capsule_video',2,0),
  ('55555555-0000-0000-0000-000000000002','44444444-0000-0000-0000-000000000001','Tokens, contexte et limites','texte',12,1),
  ('55555555-0000-0000-0000-000000000003','44444444-0000-0000-0000-000000000001','Quiz : les bases','quiz',5,2)
on conflict do nothing;

-- Badges
insert into badges (organization_id, nom, description, icone, condition) values
  ('11111111-1111-1111-1111-111111111111','Explorateur','Première formation démarrée','Compass','start_first'),
  ('11111111-1111-1111-1111-111111111111','Prompt Master','Score de 90+ au laboratoire IA','Wand2','lab_90'),
  ('11111111-1111-1111-1111-111111111111','Expert IA','Formation IA avancée terminée','BrainCircuit','ia_advanced')
on conflict do nothing;

-- Bibliothèque de prompts
insert into prompt_library (organization_id, titre, domaine, niveau, contenu) values
  ('11111111-1111-1111-1111-111111111111','Analyse d''un bilan comptable','Comptabilité','intermediaire',
   'Tu es expert-comptable. Analyse le bilan suivant et identifie les 3 principaux risques financiers, avec recommandation chiffrée. Format : tableau.'),
  ('11111111-1111-1111-1111-111111111111','Synthèse RGPD pour dirigeants','Juridique','debutant',
   'Explique les obligations RGPD clés d''une PME en 5 points actionnables, sans jargon.')
on conflict do nothing;

-- Abonnement de démo
insert into subscriptions (organization_id, plan, status) values
  ('11111111-1111-1111-1111-111111111111','pro','active')
on conflict do nothing;
