import { headers } from "next/headers";
import { UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LienInvitation } from "@/components/admin/lien-invitation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseEnabled } from "@/lib/supabase/config";
import { inviterMembre } from "./actions";

export const dynamic = "force-dynamic";

const roleBadge: Record<string, { label: string; variant: "brand" | "success" | "muted" }> = {
  admin: { label: "Administrateur", variant: "brand" },
  super_admin: { label: "Super admin", variant: "brand" },
  formateur: { label: "Formateur", variant: "success" },
  apprenant: { label: "Apprenant", variant: "muted" },
};

type Membre = {
  id: string;
  nom: string | null;
  prenom: string | null;
  role: string;
  email?: string;
  confirme?: boolean;
};

export default async function EquipePage({
  searchParams,
}: {
  searchParams: Promise<{ sent?: string; error?: string }>;
}) {
  const { sent, error } = await searchParams;

  let membres: Membre[] = [];
  let lienInvitation: string | null = null;
  if (isSupabaseEnabled()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const admin = createAdminClient();
      const { data: me } = await admin
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .maybeSingle();
      if (me?.organization_id) {
        const { data: org } = await admin
          .from("organizations")
          .select("invite_code")
          .eq("id", me.organization_id)
          .maybeSingle();
        if (org?.invite_code) {
          const origin = (await headers()).get("origin") ?? "";
          lienInvitation = `${origin}/invitation/${org.invite_code}`;
        }
        const [{ data: profils }, { data: users }] = await Promise.all([
          admin
            .from("profiles")
            .select("id, nom, prenom, role")
            .eq("organization_id", me.organization_id)
            .order("created_at", { ascending: true }),
          admin.auth.admin.listUsers({ perPage: 1000 }),
        ]);
        const emailById = new Map(
          (users?.users ?? []).map((u) => [u.id, { email: u.email, confirme: !!u.email_confirmed_at }])
        );
        membres = (profils ?? []).map((p) => ({
          ...p,
          email: emailById.get(p.id)?.email,
          confirme: emailById.get(p.id)?.confirme,
        }));
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Équipe</h1>
        <p className="mt-1 text-muted-foreground">
          Invitez vos apprenants et formateurs : ils recevront un email pour
          rejoindre votre organisation.
        </p>
      </div>

      {sent && (
        <p className="rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
          Invitation envoyée à {sent}.
        </p>
      )}
      {error && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      {lienInvitation && <LienInvitation url={lienInvitation} />}

      <Card className="p-5">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <UserPlus className="size-4 text-brand" /> Inviter un membre
        </p>
        <form action={inviterMembre} className="flex flex-col gap-2 sm:flex-row">
          <Input
            name="email"
            type="email"
            required
            placeholder="prenom.nom@entreprise.fr"
            className="flex-1"
          />
          <select
            name="role"
            defaultValue="apprenant"
            className="h-10 rounded-lg border border-input bg-background px-3 text-sm"
          >
            <option value="apprenant">Apprenant</option>
            <option value="formateur">Formateur</option>
          </select>
          <Button variant="brand" type="submit">
            Envoyer l&apos;invitation
          </Button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Membre</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Rôle</th>
                <th className="px-4 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {membres.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    Aucun membre pour l&apos;instant.
                  </td>
                </tr>
              ) : (
                membres.map((m) => {
                  const nom =
                    [m.prenom, m.nom].filter(Boolean).join(" ").trim() || "—";
                  const r = roleBadge[m.role] ?? roleBadge.apprenant;
                  return (
                    <tr key={m.id} className="hover:bg-accent/40">
                      <td className="px-4 py-3 font-medium">{nom}</td>
                      <td className="px-4 py-3 text-muted-foreground">{m.email ?? "—"}</td>
                      <td className="px-4 py-3">
                        <Badge variant={r.variant}>{r.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={m.confirme ? "success" : "warning"}>
                          {m.confirme ? "Actif" : "Invitation en attente"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
