-- ============================================================
-- 0003 — Lecture publique du catalogue (pages marketing anonymes)
-- ============================================================
-- Les policies 0001 exigent `current_org()` : un visiteur anonyme (ou un
-- utilisateur d'une autre organisation) ne voyait donc AUCUNE formation sur
-- les pages publiques (accueil, catalogue, fiche, cours). On ajoute une
-- lecture publique restreinte aux formations PUBLIÉES — modèle marketplace.
-- Les policies par organisation (0001) restent en place (brouillons, écriture).

create policy formations_public_read on formations
  for select using (status = 'publiee');

-- Bibliothèque de prompts et catalogue de badges : contenu non sensible,
-- affiché sur des pages publiques (/laboratoire) ou partagées.
create policy prompts_public_read on prompt_library
  for select using (true);

create policy badges_public_read on badges
  for select using (true);
