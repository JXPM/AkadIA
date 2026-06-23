import { AppShell, type NavItem } from "@/components/layout/app-shell";
import { getCurrentProfile } from "@/lib/queries";

const nav: NavItem[] = [
  { href: "/app/dashboard", label: "Tableau de bord", icon: "LayoutDashboard" },
  { href: "/catalogue", label: "Catalogue", icon: "BookOpen" },
  { href: "/laboratoire", label: "Laboratoire IA", icon: "FlaskConical" },
  { href: "/formateur", label: "Mode formateur", icon: "MonitorPlay" },
  { href: "/admin", label: "Administration", icon: "Settings" },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  return (
    <AppShell nav={nav} userName={profile?.userName} role={profile?.role ?? "Apprenant"}>
      {children}
    </AppShell>
  );
}
