# AKADIA — Learning Operating System intelligent

LMS SaaS multi-tenant qui permet de **créer, gérer, vendre, animer et suivre** des formations professionnelles illimitées, avec l'**IA générative intégrée partout**.

> Spec vivante & second cerveau du projet dans [`wiki/`](./wiki) (vault Obsidian, pattern *LLM Wiki*).

## Démarrage rapide
```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_DEMO_MODE=1 pour tourner sans Supabase
npm run dev                  # http://localhost:3000
```

## Fonctionnalités
- 🌐 **Site public** : accueil, catalogue/marketplace, fiches formation, tarifs, blog, contact
- 🎓 **Espace apprenant** : dashboard, lecteur de cours 3 colonnes, gamification
- 🤖 **Moteur IA** : assistant **AKA**, générateur de formations, laboratoire & bibliothèque de prompts
- 🧑‍🏫 **Mode formateur présentiel** : sessions live, quiz/ateliers/escape games, projection, classement temps réel
- 🛠️ **Administration** : gestion des formations, rôles & permissions, analytics
- 🎨 **Design premium** : bleu nuit / bleu électrique, Inter/Geist, mode clair-sombre, WCAG

## Stack
Next.js 16 · React 19 · TypeScript · Tailwind v4 · shadcn-style UI · Framer Motion · Supabase · Vercel AI SDK (AI Gateway).

## Structure
- `src/app` — routes (route groups marketing / auth / app / admin)
- `src/components` — UI, layout, marketing, cours
- `src/lib` — types, données démo, IA, clients Supabase
- `supabase/` — schéma SQL (`migrations/0001_init.sql`) + seed
- `docs/` — documentations technique, admin, formateur, apprenant
- `wiki/` — base de connaissances (LLM Wiki)

## Décisions par défaut (à confirmer)
- LLM : **Claude via Vercel AI Gateway**
- Multi-tenant : **RLS par `organization_id`**
- Paiements : **Stripe** (intégration à finaliser)

Voir [`docs/01-documentation-technique.md`](./docs/01-documentation-technique.md).
