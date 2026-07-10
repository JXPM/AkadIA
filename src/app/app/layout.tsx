import { AppShell, type NavItem } from "@/components/layout/app-shell";
import { getCurrentProfile, isSupabaseEnabled } from "@/lib/queries";

const baseNav: NavItem[] = [
  { href: "/app/dashboard", label: "Tableau de bord", icon: "LayoutDashboard" },
  { href: "/catalogue", label: "Catalogue", icon: "BookOpen" },
  { href: "/laboratoire", label: "Laboratoire IA", icon: "FlaskConical" },
];

const formateurNav: NavItem[] = [
  { href: "/formateur", label: "Mode formateur", icon: "MonitorPlay" },
];

const adminNav: NavItem[] = [
  { href: "/admin", label: "Administration", icon: "Settings" },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  // Démo : tout visible. Sinon, la navigation dépend du rôle.
  const roleKey = isSupabaseEnabled() ? (profile?.roleKey ?? "apprenant") : "admin";
  const nav = [
    ...baseNav,
    ...(roleKey === "formateur" || roleKey === "admin" || roleKey === "super_admin"
      ? formateurNav
      : []),
    ...(roleKey === "admin" || roleKey === "super_admin" ? adminNav : []),
  ];

  return (
    <AppShell nav={nav} userName={profile?.userName} role={profile?.role ?? "Apprenant"}>
      {children}
    </AppShell>
  );
}
