import { AppShell, type NavItem } from "@/components/layout/app-shell";
import { getCurrentProfile } from "@/lib/queries";

const nav: NavItem[] = [
  { href: "/admin", label: "Vue d'ensemble", icon: "BarChart3" },
  { href: "/admin/formations", label: "Formations", icon: "FolderKanban" },
  { href: "/admin/formations/nouvelle", label: "Générateur IA", icon: "GraduationCap" },
  { href: "/app/dashboard", label: "Espace apprenant", icon: "BookOpen" },
  { href: "/formateur", label: "Mode formateur", icon: "MonitorPlay" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  return (
    <AppShell nav={nav} role={profile?.role ?? "Administrateur"} userName={profile?.userName ?? "Admin AKADIA"}>
      {children}
    </AppShell>
  );
}
