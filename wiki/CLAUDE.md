---
type: index
tags: [akadia, schema, llm-wiki]
updated: 2026-06-23
---

# Schéma du Wiki — Second cerveau « AkadIA »

> [!info] Ce fichier configure l'agent LLM comme **mainteneur du wiki**, pas comme chatbot générique.
> Toute session travaillant dans `wiki/` lit ce fichier **en premier**. Il décrit la structure, les conventions et les workflows (ingest / query / lint). Il **co-évolue** avec Johan : quand on découvre une convention qui marche, on la code ici.

Ce wiki est le **second cerveau** du projet **AkadIA**. Il applique le pattern *LLM Wiki* (Memex de Vannevar Bush, 1945) : au lieu de re-découvrir le savoir à chaque question (RAG), le LLM **compile une fois** la connaissance dans des pages markdown interreliées, puis les **maintient à jour** à chaque nouvelle source. Le wiki est un **artefact persistant et cumulatif** : les cross-références sont déjà là, les contradictions déjà signalées, la synthèse reflète déjà tout ce qui a été lu.

> [!important] Domaine d'AkadIA — **éducatif / académique** (confirmé 2026-06-23)
> AkadIA est un projet du domaine **éducatif/académique** (« Akad » = academia + IA) : savoir, cours, pédagogie assistée par IA. Le wiki documente le sujet pédagogique **et** le produit qui le porte (probable app web → volet UI/design via [[uipro]], [[aura.build]], [[Awwwards]]). Le périmètre fin (public, matières, fonctionnalités) se précise avec les sources ; affiner §2 (familles de pages) au fil de l'eau.

**Répartition des rôles** : Johan source, explore, pose les bonnes questions. Le LLM fait tout le reste — résumer, cross-référencer, classer, tenir l'index et le log. Obsidian est l'IDE ; le LLM est le programmeur ; le wiki est le code.

---

## 1. Les trois couches

1. **Sources brutes** (`wiki/assets/`) — documents curés : captures, PDF, transcripts, exports, articles clippés, screenshots de sites. **Immuables** : on les lit, on ne les modifie jamais. C'est la source de vérité. Le **code** (s'il existe un jour dans `AkadIA/`) est aussi une source primaire, référencée par chemin (`src/app.tsx:42`).
2. **Le wiki** (`wiki/sources/`, `wiki/pages/`, `wiki/syntheses/`) — pages markdown **générées et maintenues par le LLM**. Johan lit ; le LLM écrit.
3. **Le schéma** (ce fichier) — règles et workflows.

---

## 2. Structure des dossiers

```
wiki/
  CLAUDE.md          ← ce schéma (lu en premier)
  index.md           ← catalogue exhaustif du wiki (orienté contenu)
  log.md             ← journal chronologique append-only
  sources/           ← une page par source ingérée (résumé + lien vers le brut)
  pages/             ← pages de synthèse (entités, concepts, systèmes, MOC)
  syntheses/         ← réponses substantielles filées (via /query → /save)
  assets/            ← fichiers BRUTS (PDF, images, exports, screenshots) = le "raw"
  .claude/commands/  ← /ingest /query /save /lint
  .obsidian/         ← config Obsidian (plugins, graph, apparence)
```

- `pages/00 - Index (MOC).md` = **carte narrative** « par où commencer » (curatée, liens thématiques).
- `index.md` = **catalogue exhaustif** auto-maintenu (chaque page + résumé d'une ligne + métadonnées). Différent du MOC : l'un raconte, l'autre liste.

### Conventions de nommage
- **Pages de systèmes/topics** : préfixe numérique stable — l'ordre encode des familles (à affiner selon le domaine) :
  - **0x** fondations / vue d'ensemble · **1x** cœur métier · **2x** UI / design · **3x** automatisation / intégrations · **4x** infra / déploiement · **5x** référence (outils, liens).
- **Pages d'entités/concepts** : nom lisible sans numéro (ex. `Playwright.md`).
- **Sources** : `AAAA-MM-JJ - Titre court.md` (date du document/événement, **pas** de l'ingest).

---

## 3. Frontmatter (YAML) — obligatoire sur chaque page

```yaml
---
type: source | entity | concept | system | reference | synthesis | moc | index | log
tags: [akadia, ...]
updated: AAAA-MM-JJ          # date de dernière modif par le LLM
status: stable | draft | a-verifier   # optionnel
sources: ["[[AAAA-MM-JJ - Titre]]"]   # sources qui appuient la page (si pertinent)
---
```
- Permet à **Dataview** de générer des tables dynamiques.
- `updated` = date du jour de la modif. Convertir toute date relative en absolue.

---

## 4. Conventions d'écriture
- **Français**, ton dense et factuel.
- **Liens internes** `[[Nom de page]]` **partout** — c'est le cœur du wiki. Lier généreusement ; un `[[lien]]` vers une page pas encore créée est OK (il marque un manque à combler).
- **Callouts Obsidian** : `> [!important]`, `> [!warning]`, `> [!note]`, `> [!tip]`, `> [!question]`.
- **Contradictions** : ne JAMAIS écraser silencieusement une info qui en contredit une autre. Créer un callout `> [!warning] Contradiction` ou `> [!question] À vérifier` exposant les deux versions + leur source + date. C'est une fonctionnalité, pas un défaut.
- Citer la source d'un fait non trivial : `([[2026-06-23 - Titre]])` ou chemin de fichier `src/main.ts:12`.
- Éviter la duplication : un fait vit dans **une** page canonique ; les autres y lient.
- **Images** : le LLM ne lit pas le markdown avec images inline en une passe. Lire le texte d'abord, puis ouvrir les images de `assets/` séparément via Read pour le contexte visuel.

---

## 5. Workflows

### 5.1 Ingest (ajouter une source)
Quand Johan dépose une source et demande de l'ingérer :
1. **Lire** la source en entier (PDF via Read `pages` ; image via vue ; code via Read ; URL via WebFetch ou **Playwright** pour les sites JS/interactifs + screenshot dans `assets/`).
2. **Discuter** 2–5 takeaways clés avec Johan (ce qui surprend, ce qui contredit l'existant).
3. **Créer** `wiki/sources/AAAA-MM-JJ - Titre.md` : métadonnées + résumé structuré (faits, entités, concepts, citations) + lien vers le brut dans `assets/` + section « Ce que ça change dans le wiki ».
4. **Propager** : créer/mettre à jour les pages d'entités/concepts/systèmes concernées (une source touche souvent 5–15 pages). Ajouter/réviser les cross-références. **Flaguer les contradictions.**
5. **Mettre à jour** `index.md` (nouvelle entrée) et **`log.md`** (entrée `ingest`).
6. **Rapporter** : pages créées/modifiées, contradictions, questions ouvertes.
- Par défaut : ingest **une source à la fois**, en restant impliqué. Batch possible si Johan le demande.

### 5.2 Query (poser une question)
1. Lire `index.md` pour repérer les pages pertinentes, puis y entrer (pas de RAG embeddings : l'index suffit à cette échelle).
2. Synthétiser une réponse **avec citations** (liens internes `[[page]]` + chemins de fichiers).
3. **Filer les bonnes réponses dans le wiki** : si la réponse produit une analyse/comparaison utile, en faire une **nouvelle page** `syntheses/` (ne pas la laisser mourir dans le chat). Mettre à jour `index.md` + `log.md` (entrée `query`).
- Formats possibles selon la question : page markdown, table comparative, deck Marp, graphique, canvas.

### 5.3 Lint (santé du wiki)
Sur demande, passer en revue :
- **contradictions** entre pages, **affirmations périmées** (sources plus récentes les ont dépassées).
- **pages orphelines** (aucun lien entrant), **concepts cités sans page dédiée**, **cross-références manquantes**.
- **trous de données** comblables par une lecture de code ou une recherche web.
- frontmatter non conforme (`type` manquant, etc.).
- Proposer de **nouvelles questions à creuser** et **nouvelles sources** à chercher. Journaliser (`log.md`, entrée `lint`).

---

## 6. Format du log (`log.md`)
Append-only. Chaque entrée commence par un préfixe **parsable** :
```
## [AAAA-MM-JJ] <ingest|query|lint|setup|maintenance> | <titre court>
- détail…
```
→ `grep "^## \[" wiki/log.md | tail -5` donne les 5 dernières actions.

---

## 7. Boîte à outils (à garder installée et à utiliser)
Outils standing du projet, à mobiliser selon le besoin (voir [[Boîte à outils AkadIA]]) :
- **Playwright** (MCP `mcp__plugin_playwright_playwright__*`) — naviguer/cliquer/screenshotter des sites pour les ingérer (sources web JS, captures dans `assets/`). [[Playwright]]
- **uipro** (CLI `uipro init --ai claude`) — scaffolding de composants UI assisté par IA, pour le volet design/web. [[uipro]]
- **aura.build** (`https://www.aura.build/components`) — bibliothèque de sections/composants UI, source d'inspiration & de patterns. [[aura.build]]
- **awwwards** (`https://www.awwwards.com/websites/parallax/`) — vitrine de sites primés (parallax, etc.), référence design. [[Awwwards]]
- **Obsidian** — IDE de lecture ; graph view pour voir la forme du wiki ; Web Clipper pour clipper des articles ; Dataview (frontmatter) & Marp (slides) à installer au besoin.

---

## 8. Garde-fous
- **Ne pas committer** sans que Johan le demande. (Le wiki peut devenir un repo git → historique gratuit.)
- **Ne pas toucher** au code applicatif depuis une session « wiki » sauf demande explicite : ici on documente.
- Vérifier qu'un fait issu d'une page reflète encore la réalité **avant** de s'en servir comme vérité (les sources évoluent ; les pages datent).
- Distinguer ce `CLAUDE.md` (décrit le **wiki**) d'un éventuel `CLAUDE.md` racine du dépôt (décrirait le **logiciel**).

## 9. Commandes (slash) — installées
Quatre commandes (`.claude/commands/`) délèguent aux workflows du §5 :
- **`/ingest <source>`** — ingérer une source (workflow §5.1).
- **`/query <question>`** — répondre depuis le wiki (workflow §5.2).
- **`/save [slug]`** — filer la dernière réponse dans `wiki/syntheses/` (`type: synthesis`).
- **`/lint`** — santé du wiki (workflow §5.3).
