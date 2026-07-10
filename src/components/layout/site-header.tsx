"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/tarifs", label: "Entreprises" },
  { href: "/a-propos", label: "À propos" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

// Session lue côté client pour garder les pages marketing statiques.
function useSessionName(): string | null {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_DEMO_MODE === "1" ||
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) return;
      const prenom = (u.user_metadata?.prenom as string | undefined)?.trim();
      setName(prenom || u.email || "Mon compte");
    });
  }, []);

  return name;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const sessionName = useSessionName();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {sessionName ? (
            <Button variant="brand" size="sm" asChild>
              <Link href="/app/dashboard">
                <LayoutDashboard className="size-4" /> Mon espace
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/connexion">Connexion</Link>
              </Button>
              <Button variant="brand" size="sm" asChild>
                <Link href="/inscription">Créer un compte</Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border md:hidden",
          open ? "block" : "hidden"
        )}
      >
        <nav className="space-y-1 px-4 py-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            {sessionName ? (
              <Button variant="brand" size="sm" className="flex-1" asChild>
                <Link href="/app/dashboard" onClick={() => setOpen(false)}>
                  <LayoutDashboard className="size-4" /> Mon espace
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href="/connexion">Connexion</Link>
                </Button>
                <Button variant="brand" size="sm" className="flex-1" asChild>
                  <Link href="/inscription">Créer un compte</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
