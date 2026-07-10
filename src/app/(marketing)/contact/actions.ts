"use server";

import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/email";

export async function envoyerMessageContact(formData: FormData) {
  const prenom = String(formData.get("prenom") ?? "").trim();
  const nom = String(formData.get("nom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!email || message.length < 10) {
    redirect(
      "/contact?error=" +
        encodeURIComponent("Email et message (10 caractères minimum) requis.")
    );
  }

  const destinataire = process.env.CONTACT_EMAIL ?? process.env.SMTP_USER;
  if (!destinataire) {
    redirect(
      "/contact?error=" + encodeURIComponent("Le formulaire est momentanément indisponible.")
    );
  }

  const { sent } = await sendEmail({
    to: destinataire!,
    subject: `[AKADIA Contact] ${prenom} ${nom}`.trim(),
    html: `<h2>Nouveau message via le formulaire de contact</h2>
<p><strong>Nom :</strong> ${prenom} ${nom}<br/>
<strong>Email :</strong> ${email}</p>
<p style="white-space:pre-wrap;border-left:3px solid #2f6bff;padding-left:12px;">${message
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")}</p>`,
    text: `Nouveau message de ${prenom} ${nom} <${email}>\n\n${message}`,
  });

  redirect(sent ? "/contact?sent=1" : "/contact?error=" + encodeURIComponent("L'envoi a échoué, réessayez."));
}
