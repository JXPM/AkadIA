"use client";

import { useMemo, useState } from "react";
import { LordIcon } from "@/components/ui/lord-icon";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FormationCard } from "@/components/formation-card";
import { categories } from "@/lib/data";
import type { Formation } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CatalogueClient({ formations }: { formations: Formation[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);

  const published = useMemo(
    () => formations.filter((f) => f.status === "publiee"),
    [formations]
  );
  const results = useMemo(() => {
    return published.filter((f) => {
      const matchCat = !cat || f.categorie === cat;
      const matchQ =
        !q ||
        f.titre.toLowerCase().includes(q.toLowerCase()) ||
        f.tags.some((t) => t.toLowerCase().includes(q.toLowerCase()));
      return matchCat && matchQ;
    });
  }, [q, cat, published]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Catalogue des formations
        </h1>
        <p className="mt-3 text-muted-foreground">
          {published.length} formations pour développer les compétences de vos
          équipes — augmentées par l&apos;IA.
        </p>
      </div>

      <div className="group relative mt-8 max-w-md">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2">
          <LordIcon icon="recherche" size={18} trigger="loop-on-hover" target=".group" />
        </span>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une formation, un tag…"
          className="pl-9"
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCat(null)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm transition-colors",
            !cat
              ? "border-transparent bg-primary text-primary-foreground"
              : "border-border hover:bg-accent"
          )}
        >
          Toutes
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              cat === c
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border hover:bg-accent"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10">
        {results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            Aucune formation ne correspond à votre recherche.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((f) => (
              <FormationCard key={f.id} formation={f} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-6">
        <Badge variant="muted">{results.length} résultat(s)</Badge>
      </div>
    </div>
  );
}
