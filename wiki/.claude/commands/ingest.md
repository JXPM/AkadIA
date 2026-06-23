---
description: Ingérer une source dans le wiki (résumé + propagation + index/log)
argument-hint: <chemin-source (wiki/assets/...) ou URL>
---

Exécute le workflow **INGEST** défini dans `wiki/CLAUDE.md` §5.1 sur : $ARGUMENTS

Étapes :
1. Lire la source à $ARGUMENTS (URL → WebFetch, ou **Playwright** pour sites JS + screenshot dans `wiki/assets/` ; PDF via Read `pages` ; image via vue ; code via chemin).
2. Discuter 2–5 takeaways clés avec Johan.
3. Créer `wiki/sources/AAAA-MM-JJ - Titre.md` : métadonnées + résumé structuré (faits, entités, concepts, citations) + lien vers le brut dans `wiki/assets/` + section « Ce que ça change dans le wiki ».
4. Créer/mettre à jour les pages d'entités/concepts/systèmes concernées dans `wiki/pages/` ; **flaguer les contradictions** avec `> [!warning]` (ne jamais écraser silencieusement).
5. Mettre à jour `wiki/index.md`.
6. Ajouter une entrée à `wiki/log.md` (`## [AAAA-MM-JJ] ingest | <titre>`).
7. Rapporter : pages créées/modifiées, contradictions, questions ouvertes.
