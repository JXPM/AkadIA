// Types du domaine AKADIA — alignés sur wiki/pages/40 - Base de données Supabase

export type Role = "super_admin" | "admin" | "formateur" | "apprenant";
export type Difficulte = "Débutant" | "Intermédiaire" | "Avancé";
export type FormationStatus = "brouillon" | "publiee" | "archivee";

export type LessonType =
  | "texte"
  | "interactive"
  | "presentation"
  | "pdf"
  | "fichier"
  | "etude_de_cas"
  | "quiz"
  | "atelier"
  | "challenge"
  | "escape_game"
  | "simulation"
  | "classe_virtuelle"
  | "capsule_video"
  | "webinaire";

export type QuestionType =
  | "qcm"
  | "vrai_faux"
  | "glisser_deposer"
  | "cas_pratique"
  | "reponse_libre";

export interface Lesson {
  id: string;
  titre: string;
  type: LessonType;
  duree: number; // minutes
  contenu?: string;
}

export interface Chapitre {
  id: string;
  titre: string;
  lessons: Lesson[];
}

export interface Module {
  id: string;
  titre: string;
  chapitres: Chapitre[];
}

export interface Formation {
  id: string;
  slug: string;
  titre: string;
  description: string;
  image: string;
  auteur: string;
  categorie: string;
  difficulte: Difficulte;
  duree: number; // heures
  tags: string[];
  objectifs: string[];
  status: FormationStatus;
  note: number;
  apprenants: number;
  modules: Module[];
}

export interface PromptEntry {
  id: string;
  titre: string;
  domaine: string;
  niveau: Difficulte;
  contenu: string;
  favori?: boolean;
}

export interface BadgeDef {
  id: string;
  nom: string;
  description: string;
  icone: string;
  obtenu: boolean;
}
