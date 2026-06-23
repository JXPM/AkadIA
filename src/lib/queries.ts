// Couche d'accès aux données AKADIA.
//
// Chaque fonction interroge Supabase quand le backend est branché
// (clés présentes ET NEXT_PUBLIC_DEMO_MODE != "1"), sinon retombe sur le jeu
// de données local de `data.ts`. L'app reste donc runnable sans backend
// (garde-fou CLAUDE.md : le mode démo doit toujours fonctionner).
// NB: server-only de fait — `createClient` importe `next/headers`.
import { createClient } from "./supabase/server";
import { isSupabaseEnabled } from "./supabase/config";
import {
  formations as demoFormations,
  promptLibrary as demoPromptLibrary,
  badges as demoBadges,
  getFormation as getDemoFormation,
} from "./data";
import type {
  Formation,
  Module,
  Chapitre,
  Lesson,
  LessonType,
  PromptEntry,
  BadgeDef,
  Difficulte,
  FormationStatus,
} from "./types";

export { isSupabaseEnabled };

// ---------- Mappers DB (enums snake_case) -> domaine (libellés UI) ----------

const difficulteFromDb: Record<string, Difficulte> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

function mapDifficulte(v: string | null): Difficulte {
  return difficulteFromDb[v ?? "debutant"] ?? "Débutant";
}

type FormationRow = {
  id: string;
  slug: string;
  titre: string;
  description: string | null;
  image_url: string | null;
  categorie: string | null;
  difficulte: string | null;
  duree_heures: number | null;
  tags: string[] | null;
  objectifs: string[] | null;
  status: FormationStatus;
  note: number | null;
  apprenants_count: number | null;
  auteur: { nom: string | null; prenom: string | null } | null;
  modules:
    | {
        id: string;
        titre: string;
        position: number | null;
        chapitres:
          | {
              id: string;
              titre: string;
              position: number | null;
              lessons:
                | {
                    id: string;
                    titre: string;
                    type: LessonType;
                    duree_min: number | null;
                    contenu: unknown;
                    position: number | null;
                  }[]
                | null;
            }[]
          | null;
      }[]
    | null;
};

const byPosition = (a: { position: number | null }, b: { position: number | null }) =>
  (a.position ?? 0) - (b.position ?? 0);

function mapFormation(row: FormationRow): Formation {
  const auteur =
    [row.auteur?.prenom, row.auteur?.nom].filter(Boolean).join(" ").trim() || "AKADIA";

  const modules: Module[] = (row.modules ?? [])
    .slice()
    .sort(byPosition)
    .map((m) => ({
      id: m.id,
      titre: m.titre,
      chapitres: (m.chapitres ?? [])
        .slice()
        .sort(byPosition)
        .map<Chapitre>((c) => ({
          id: c.id,
          titre: c.titre,
          lessons: (c.lessons ?? [])
            .slice()
            .sort(byPosition)
            .map<Lesson>((l) => ({
              id: l.id,
              titre: l.titre,
              type: l.type,
              duree: l.duree_min ?? 0,
              contenu: typeof l.contenu === "string" ? l.contenu : undefined,
            })),
        })),
    }));

  return {
    id: row.id,
    slug: row.slug,
    titre: row.titre,
    description: row.description ?? "",
    image: row.image_url ?? "",
    auteur,
    categorie: row.categorie ?? "",
    difficulte: mapDifficulte(row.difficulte),
    duree: Number(row.duree_heures ?? 0),
    tags: row.tags ?? [],
    objectifs: row.objectifs ?? [],
    status: row.status,
    note: Number(row.note ?? 0),
    apprenants: row.apprenants_count ?? 0,
    modules,
  };
}

const FORMATION_SELECT =
  "id, slug, titre, description, image_url, categorie, difficulte, duree_heures, tags, objectifs, status, note, apprenants_count, auteur:profiles(nom, prenom), modules(id, titre, position, chapitres(id, titre, position, lessons(id, titre, type, duree_min, contenu, position)))";

// ---------- Requêtes ----------

/** Toutes les formations publiées (RLS filtre par organisation côté DB). */
export async function getFormations(): Promise<Formation[]> {
  if (!isSupabaseEnabled()) return demoFormations;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("formations")
    .select(FORMATION_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[queries] getFormations:", error.message);
    return demoFormations;
  }
  return (data as unknown as FormationRow[]).map(mapFormation);
}

/** Une formation par slug, ou null si absente. */
export async function getFormationBySlug(slug: string): Promise<Formation | null> {
  if (!isSupabaseEnabled()) return getDemoFormation(slug) ?? null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("formations")
    .select(FORMATION_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("[queries] getFormationBySlug:", error.message);
    return getDemoFormation(slug) ?? null;
  }
  return data ? mapFormation(data as unknown as FormationRow) : null;
}

/** Bibliothèque de prompts. */
export async function getPromptLibrary(): Promise<PromptEntry[]> {
  if (!isSupabaseEnabled()) return demoPromptLibrary;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("prompt_library")
    .select("id, titre, domaine, niveau, contenu, favori")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[queries] getPromptLibrary:", error.message);
    return demoPromptLibrary;
  }
  return (data ?? []).map((p) => ({
    id: p.id,
    titre: p.titre,
    domaine: p.domaine ?? "",
    niveau: mapDifficulte(p.niveau),
    contenu: p.contenu,
    favori: p.favori ?? false,
  }));
}

const roleLabel: Record<string, string> = {
  apprenant: "Apprenant",
  formateur: "Formateur",
  admin: "Administrateur",
  super_admin: "Super admin",
};

/** Profil de l'utilisateur connecté (nom affichable + libellé de rôle), ou null. */
export async function getCurrentProfile(): Promise<{ userName: string; role: string } | null> {
  if (!isSupabaseEnabled()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("nom, prenom, role")
    .eq("id", user.id)
    .maybeSingle();

  const userName =
    [data?.prenom, data?.nom].filter(Boolean).join(" ").trim() ||
    user.email ||
    "Utilisateur";
  return { userName, role: roleLabel[data?.role ?? "apprenant"] ?? "Apprenant" };
}

/** Badges (définitions). Le statut "obtenu" reste géré côté apprenant. */
export async function getBadges(): Promise<BadgeDef[]> {
  if (!isSupabaseEnabled()) return demoBadges;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("badges")
    .select("id, nom, description, icone");

  if (error) {
    console.error("[queries] getBadges:", error.message);
    return demoBadges;
  }
  return (data ?? []).map((b) => ({
    id: b.id,
    nom: b.nom,
    description: b.description ?? "",
    icone: b.icone ?? "Award",
    obtenu: false,
  }));
}
