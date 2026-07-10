// Espace d'atterrissage selon le rôle : chacun arrive chez lui.
export function roleHome(roleKey: string | null | undefined): string {
  if (roleKey === "admin" || roleKey === "super_admin") return "/admin";
  if (roleKey === "formateur") return "/formateur";
  return "/app/dashboard";
}
