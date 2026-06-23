import Link from "next/link";
import { Users, BookOpen, TrendingUp, Euro, Plus, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFormations } from "@/lib/queries";
import { formatNumber } from "@/lib/utils";

const kpis = [
  { label: "Apprenants", value: "12 480", icon: Users, delta: "+5,2 %" },
  { label: "Formations actives", value: "86", icon: BookOpen, delta: "+3" },
  { label: "Taux de complétion", value: "87 %", icon: TrendingUp, delta: "+1,4 %" },
  { label: "Revenus (mois)", value: "48 200 €", icon: Euro, delta: "+9,1 %" },
];

export default async function AdminPage() {
  const formations = await getFormations();
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Vue d&apos;ensemble</h1>
          <p className="mt-1 text-muted-foreground">
            Pilotage de votre organisation sur AKADIA.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/formations/nouvelle">
              <Sparkles className="size-4" /> Générer avec l&apos;IA
            </Link>
          </Button>
          <Button variant="brand" asChild>
            <Link href="/admin/formations">
              <Plus className="size-4" /> Nouvelle formation
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-lg bg-brand/10 text-brand">
                  <k.icon className="size-5" />
                </span>
                <Badge variant="success">{k.delta}</Badge>
              </div>
              <p className="mt-3 text-2xl font-bold">{k.value}</p>
              <p className="text-xs text-muted-foreground">{k.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Activité (7 derniers jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-end gap-2">
              {[40, 65, 52, 78, 60, 92, 70].map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-brand/80"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {["L", "M", "M", "J", "V", "S", "D"][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top formations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {formations.slice(0, 4).map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-2">
                <span className="truncate text-sm">{f.titre}</span>
                <Badge variant="muted">{formatNumber(f.apprenants)}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
