import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSessionByCode } from "@/lib/live";

// Un invité rejoint une session avec le code + un pseudo (sans compte).
export async function POST(req: Request) {
  const { code, pseudo } = await req.json().catch(() => ({}));
  const pseudoClean = String(pseudo ?? "").trim().slice(0, 24);

  if (!code || pseudoClean.length < 2) {
    return NextResponse.json(
      { error: "Code de session et pseudo (2 caractères minimum) requis." },
      { status: 400 }
    );
  }

  const session = await getSessionByCode(String(code));
  if (!session) {
    return NextResponse.json({ error: "Session introuvable. Vérifie le code." }, { status: 404 });
  }
  if (session.etat === "terminee") {
    return NextResponse.json({ error: "Cette session est terminée." }, { status: 410 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("session_participants")
    .insert({ session_id: session.id, pseudo: pseudoClean })
    .select("id")
    .single();

  if (error) {
    const dejaPris = error.code === "23505";
    return NextResponse.json(
      { error: dejaPris ? "Ce pseudo est déjà pris dans cette session." : "Impossible de rejoindre." },
      { status: dejaPris ? 409 : 500 }
    );
  }

  return NextResponse.json({
    participantId: data.id,
    sessionId: session.id,
    titre: session.titre,
  });
}
