import Link from "next/link";
import { Clock, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatPrice, formatNumber, cn } from "@/lib/utils";
import type { Formation } from "@/lib/types";

const gradients: Record<string, string> = {
  "gradient-1": "from-indigo-500 via-blue-600 to-sky-500",
  "gradient-2": "from-emerald-500 via-teal-600 to-cyan-500",
  "gradient-3": "from-violet-500 via-purple-600 to-fuchsia-500",
  "gradient-4": "from-rose-500 via-red-600 to-orange-500",
  "gradient-5": "from-amber-500 via-orange-600 to-yellow-500",
  "gradient-6": "from-slate-600 via-blue-800 to-slate-700",
};

export function FormationCard({ formation }: { formation: Formation }) {
  return (
    <Link href={`/catalogue/${formation.slug}`} className="group block">
      <Card className="h-full overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all">
        <div
          className={cn(
            "relative h-40 bg-gradient-to-br",
            gradients[formation.image] ?? gradients["gradient-1"]
          )}
        >
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="absolute left-3 top-3">
            <Badge variant="secondary" className="bg-white/90 text-slate-900">
              {formation.categorie}
            </Badge>
          </div>
          <div className="absolute bottom-3 right-3 text-2xl font-bold text-white/90">
            {formatPrice(formation.prix)}
          </div>
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-center gap-2">
            <Badge variant="muted">{formation.difficulte}</Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              {formation.note}
            </span>
          </div>
          <h3 className="font-semibold leading-snug group-hover:text-brand transition-colors">
            {formation.titre}
          </h3>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {formation.description}
          </p>
          <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" />
              {formation.duree}h
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-3.5" />
              {formatNumber(formation.apprenants)}
            </span>
            <span>{formation.auteur}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
