"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseEnabled } from "@/lib/supabase/config";

// Coche/décoche une leçon (table lesson_progress, RLS : chacun la sienne).
export async function basculerLeconTerminee(formData: FormData) {
  if (!isSupabaseEnabled()) return;

  const lessonId = String(formData.get("lessonId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  const dejaFaite = formData.get("dejaFaite") === "1";
  if (!lessonId || !slug) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  if (dejaFaite) {
    await supabase
      .from("lesson_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId);
  } else {
    await supabase
      .from("lesson_progress")
      .upsert({ user_id: user.id, lesson_id: lessonId });
  }

  revalidatePath(`/cours/${slug}`);
}
