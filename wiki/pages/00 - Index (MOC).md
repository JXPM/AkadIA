---
type: moc
tags: [akadia, moc]
updated: 2026-06-23
---

# 00 — Index (MOC) · Par où commencer

Carte narrative du second cerveau **AKADIA**. (Catalogue exhaustif : [[index]]. Schéma : [[CLAUDE.md]].)

## C'est quoi AKADIA ?
Un **LMS SaaS multi-tenant** — un « *Learning Operating System* » — pour créer, gérer, vendre, animer et suivre des formations professionnelles illimitées, avec l'**IA générative intégrée partout**. Concurrents : Coursera, OpenClassrooms, DataCamp, Udemy Business, Moodle, 360Learning. → [[01 - Vue d'ensemble]]

## Le parcours de lecture
1. **Comprendre le produit** → [[01 - Vue d'ensemble]]
2. **La technique** → [[02 - Stack technique & architecture]] · [[40 - Base de données Supabase]]
3. **Le design** → [[03 - Design System]]
4. **Le métier (formations)** → [[10 - Gestion & structure des formations]] · [[11 - Types de contenu]] · [[12 - Quiz intelligents]]
5. **Les espaces** → [[20 - Site public & page d'accueil]] · [[21 - Espace apprenant]] · [[22 - Page de cours]] · [[23 - Mode formateur présentiel]]
6. **Le moteur IA** (différenciateur) → [[30 - Assistant IA pédagogique (AKA)]] · [[31 - Générateur de formations IA]] · [[32 - Générateur de capsules vidéo IA]] · [[33 - Laboratoire IA]]
7. **Et après** → [[50 - Livrables attendus]]

## Familles de pages
- **0x** fondations · **1x** métier formations · **2x** espaces/UI · **3x** moteur IA · **4x** infra/données · **5x** référence.

## Décisions à trancher (questions ouvertes)
Voir les callouts `> [!question]` répartis ; les principales : fournisseur LLM, stratégie multi-tenant, paiements, pile capsules vidéo. Récap dans [[50 - Livrables attendus]].

## Boîte à outils
[[Boîte à outils AkadIA]] — [[Playwright]] · [[uipro]] · [[aura.build]] · [[Awwwards]].

## Au quotidien
`/ingest <source>` · `/query <question>` · `/save [slug]` · `/lint`.
