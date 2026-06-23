# Mise en route — Brancher Supabase (sortir du mode démo)

L'app fonctionne **sans backend** en mode démo (données locales `src/lib/data.ts`).
Pour passer sur un vrai backend Supabase, suivre ces étapes.

## 1. Créer le projet Supabase
1. Créer un projet sur https://supabase.com (ou via l'intégration Vercel Marketplace).
2. Récupérer dans *Project Settings → API* :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Configurer l'environnement
Copier `.env.example` en `.env.local` et renseigner les clés. **Désactiver le mode démo** :

```bash
NEXT_PUBLIC_DEMO_MODE=0        # 0 (ou absent) = backend Supabase actif
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

> Le bascule se fait dans `src/lib/supabase/config.ts` (`isSupabaseEnabled()`) :
> backend actif **si** `NEXT_PUBLIC_DEMO_MODE != "1"` **et** URL + anon key présentes.
> Tant que ce n'est pas le cas, toutes les requêtes retombent sur les données démo.

## 3. Appliquer le schéma
Pousser la migration et le seed :

Le plus simple : un seul fichier `supabase/apply.sql` regroupe **0001** (schéma) +
**0002** (trigger inscription + correctif RLS) + **0003** (lecture publique du
catalogue) + **seed** (données de démo).

```bash
# Option A — psql (récupérer le mot de passe : Dashboard → Settings → Database)
psql "postgresql://postgres:VOTRE_MOT_DE_PASSE@db.brrvrpxiwcvpsldpacrc.supabase.co:5432/postgres" \
  -f supabase/apply.sql

# Option B — Dashboard → SQL Editor → coller le contenu de supabase/apply.sql → Run
```

## 4. Authentification
- **Email/mot de passe** : activé par défaut. Les formulaires `/connexion` et
  `/inscription` sont câblés aux Server Actions (`src/app/(auth)/actions.ts`).
- **Google** : dans *Authentication → Providers*, activer Google et renseigner le
  client OAuth. Ajouter l'URL de callback `<origin>/auth/callback`
  (route : `src/app/auth/callback/route.ts`).
- À l'inscription, le trigger `handle_new_user` (migration `0002`) crée
  automatiquement une **organisation dédiée** + le **profil** (rôle `admin`),
  à partir des métadonnées `prenom`/`nom`/`organisation` passées dans
  `auth.signUp({ options: { data }})`.

## 5. Protection des routes
`src/middleware.ts` rafraîchit la session et protège `/app/*` et `/admin/*`
**uniquement quand le backend est branché**. En mode démo, accès libre (comportement v1).

## Architecture de la couche données
- `src/lib/queries.ts` — fonctions serveur (`getFormations`, `getFormationBySlug`,
  `getPromptLibrary`, `getBadges`, `getCurrentProfile`) : Supabase si branché, sinon démo.
- Le contenu de site (stats, features, témoignages, faq, plans, catégories) reste
  statique dans `src/lib/data.ts` — ce n'est pas de la donnée tenant.
