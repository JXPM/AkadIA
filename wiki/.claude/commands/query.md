---
description: Poser une question répondue depuis le wiki
argument-hint: <question>
---

Exécute le workflow **QUERY** défini dans `wiki/CLAUDE.md` §5.2 pour : $ARGUMENTS

Étapes :
1. Lire `wiki/index.md` pour repérer les pages pertinentes.
2. Lire ces pages et suivre les `[[wikilinks]]` au besoin.
3. Synthétiser une réponse **avec citations** `[[page]]` (et chemins de fichiers si code).
4. Si la réponse est substantielle, proposer de la filer comme `wiki/syntheses/<slug>.md` (cf. `/save`).
5. Ajouter une entrée à `wiki/log.md` (`## [AAAA-MM-JJ] query | <question>`).
