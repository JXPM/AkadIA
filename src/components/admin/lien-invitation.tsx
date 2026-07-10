"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import Image from "next/image";
import { Check, Copy, Link2, Loader2, QrCode, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { regenererLienInvitation } from "@/app/admin/equipe/actions";

// Lien d'invitation partageable de l'organisation : copie, QR, régénération.
export function LienInvitation({ url }: { url: string }) {
  const router = useRouter();
  const [copie, setCopie] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [afficherQr, setAfficherQr] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!afficherQr) return;
    QRCode.toDataURL(url, { width: 280, margin: 1 })
      .then(setQr)
      .catch(() => setQr(null));
  }, [afficherQr, url]);

  async function copier() {
    try {
      await navigator.clipboard.writeText(url);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      /* clipboard indisponible */
    }
  }

  async function regenerer() {
    if (
      !confirm(
        "Régénérer le lien ? L'ancien lien ne fonctionnera plus (les comptes déjà créés ne sont pas affectés)."
      )
    ) {
      return;
    }
    setBusy(true);
    await regenererLienInvitation();
    setAfficherQr(false);
    setQr(null);
    router.refresh();
    setBusy(false);
  }

  return (
    <Card className="p-5">
      <p className="mb-1 flex items-center gap-2 text-sm font-semibold">
        <Link2 className="size-4 text-brand" /> Lien d&apos;invitation partageable
      </p>
      <p className="mb-3 text-sm text-muted-foreground">
        Partagez ce lien (ou son QR code) : toute personne qui s&apos;inscrit par ce
        lien rejoint votre organisation comme apprenant.
      </p>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <code className="flex-1 truncate rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs">
          {url}
        </code>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copier}>
            {copie ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
            {copie ? "Copié !" : "Copier"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setAfficherQr((v) => !v)}>
            <QrCode className="size-4" /> QR code
          </Button>
          <Button variant="ghost" size="sm" onClick={regenerer} disabled={busy}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Régénérer
          </Button>
        </div>
      </div>
      {afficherQr && qr && (
        <div className="mt-4 flex justify-center">
          <Image
            src={qr}
            alt="QR code du lien d'invitation"
            width={200}
            height={200}
            unoptimized
            className="rounded-xl border border-border bg-white p-2"
          />
        </div>
      )}
    </Card>
  );
}
