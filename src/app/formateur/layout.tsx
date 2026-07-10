import { redirect } from "next/navigation";
import { getCurrentProfile, isSupabaseEnabled } from "@/lib/queries";

// Double verrou (en plus du middleware) : le mode formateur est réservé
// aux formateurs et administrateurs. La page reste un composant client.
export default async function FormateurLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (isSupabaseEnabled()) {
    const profile = await getCurrentProfile();
    const roleKey = profile?.roleKey ?? "apprenant";
    if (roleKey !== "formateur" && roleKey !== "admin" && roleKey !== "super_admin") {
      redirect("/app/dashboard");
    }
  }
  return <>{children}</>;
}
