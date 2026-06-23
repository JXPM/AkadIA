import Link from "next/link";
import { Plus, Sparkles, Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getFormations } from "@/lib/queries";
import { formatPrice, formatNumber } from "@/lib/utils";

const statusBadge = {
  publiee: { label: "Publiée", variant: "success" as const },
  brouillon: { label: "Brouillon", variant: "warning" as const },
  archivee: { label: "Archivée", variant: "muted" as const },
};

export default async function AdminFormationsPage() {
  const formations = await getFormations();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Formations</h1>
          <p className="mt-1 text-muted-foreground">
            Créez et gérez un nombre illimité de formations.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/formations/nouvelle">
              <Sparkles className="size-4" /> Générer avec l&apos;IA
            </Link>
          </Button>
          <Button variant="brand">
            <Plus className="size-4" /> Nouvelle formation
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Formation</th>
                <th className="px-4 py-3 font-medium">Catégorie</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Apprenants</th>
                <th className="px-4 py-3 font-medium">Note</th>
                <th className="px-4 py-3 font-medium">Prix</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {formations.map((f) => {
                const s = statusBadge[f.status];
                return (
                  <tr key={f.id} className="hover:bg-accent/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-9 shrink-0 rounded-md gradient-brand" />
                        <span className="font-medium">{f.titre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{f.categorie}</td>
                    <td className="px-4 py-3">
                      <Badge variant={s.variant}>{s.label}</Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatNumber(f.apprenants)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        {f.note}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatPrice(f.prix)}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" aria-label="Éditer">
                        <Pencil className="size-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
