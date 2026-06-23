"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  // Visibilité pilotée par la classe `dark` du <html> (next-themes) → pas
  // d'état `mounted` ni d'effet, donc pas de flash ni de setState-in-effect.
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Basculer le thème clair/sombre"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="hidden dark:block" />
      <Moon className="block dark:hidden" />
    </Button>
  );
}
