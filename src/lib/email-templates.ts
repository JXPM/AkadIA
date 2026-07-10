// Templates HTML des emails transactionnels AKADIA.
// Contraintes clients mail : tableaux + styles inline, pas de CSS externe.
// Couleurs alignées sur les tokens de globals.css (brand #2f6bff).

const BRAND = "#2f6bff";
const BRAND_DARK = "#0f1b33";
const MUTED = "#64748b";

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background-color:#f3f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
          <!-- En-tête dégradé -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND} 0%,#1d4ed8 100%);background-color:${BRAND};border-radius:16px 16px 0 0;padding:28px 32px;text-align:center;">
              <span style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:2px;">AKADIA</span>
              <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.85);">Le Learning Operating System intelligent</p>
            </td>
          </tr>
          <!-- Corps -->
          <tr>
            <td style="background-color:#ffffff;border-radius:0 0 16px 16px;padding:36px 32px;">
              ${content}
            </td>
          </tr>
          <!-- Pied -->
          <tr>
            <td style="padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:${MUTED};">
                © ${new Date().getFullYear()} AKADIA. Tous droits réservés.<br />
                Vous recevez cet email car une inscription a été effectuée avec cette adresse.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function invitationEmail(params: {
  organisation: string;
  invitant?: string;
  inviteUrl: string;
}): { subject: string; html: string; text: string } {
  const par = params.invitant ? ` par ${params.invitant}` : "";
  const html = layout(`
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:${BRAND_DARK};">Vous êtes invité·e 🎓</h1>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#334155;">
      Vous avez été invité·e${par} à rejoindre l'espace de formation
      <strong>${params.organisation}</strong> sur AKADIA. Activez votre compte
      pour accéder aux formations de votre organisation.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto;">
      <tr>
        <td style="border-radius:12px;background-color:${BRAND};">
          <a href="${params.inviteUrl}"
             style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;">
            Rejoindre ${params.organisation}
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:${MUTED};">
      Vous choisirez votre mot de passe à la première connexion. Si le bouton
      ne fonctionne pas, copiez-collez cette adresse :
    </p>
    <p style="margin:0 0 20px;font-size:12px;line-height:1.5;word-break:break-all;">
      <a href="${params.inviteUrl}" style="color:${BRAND};">${params.inviteUrl}</a>
    </p>
    <hr style="border:none;border-top:1px solid #e3e8f0;margin:0 0 16px;" />
    <p style="margin:0;font-size:12px;color:${MUTED};">
      Vous ne connaissez pas ${params.organisation} ? Ignorez simplement cet email.
    </p>
  `);

  return {
    subject: `Invitation à rejoindre ${params.organisation} — AKADIA`,
    html,
    text: `Vous avez été invité·e${par} à rejoindre ${params.organisation} sur AKADIA.\nActivez votre compte : ${params.inviteUrl}\n\nVous choisirez votre mot de passe à la première connexion.`,
  };
}

export function recoveryEmail(params: {
  prenom?: string;
  resetUrl: string;
}): { subject: string; html: string; text: string } {
  const bonjour = params.prenom ? `Bonjour ${params.prenom}` : "Bonjour";
  const html = layout(`
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:${BRAND_DARK};">${bonjour},</h1>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#334155;">
      Vous avez demandé la réinitialisation de votre mot de passe AKADIA.
      Cliquez sur le bouton ci-dessous pour en choisir un nouveau.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto;">
      <tr>
        <td style="border-radius:12px;background-color:${BRAND};">
          <a href="${params.resetUrl}"
             style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;">
            Réinitialiser mon mot de passe
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:${MUTED};">
      Ce lien est valable 1 heure. Si le bouton ne fonctionne pas, copiez-collez
      cette adresse dans votre navigateur :
    </p>
    <p style="margin:0 0 20px;font-size:12px;line-height:1.5;word-break:break-all;">
      <a href="${params.resetUrl}" style="color:${BRAND};">${params.resetUrl}</a>
    </p>
    <hr style="border:none;border-top:1px solid #e3e8f0;margin:0 0 16px;" />
    <p style="margin:0;font-size:12px;color:${MUTED};">
      Vous n'avez pas demandé cette réinitialisation ? Ignorez cet email,
      votre mot de passe reste inchangé.
    </p>
  `);

  return {
    subject: "Réinitialisez votre mot de passe — AKADIA",
    html,
    text: `${bonjour},\n\nRéinitialisez votre mot de passe AKADIA :\n${params.resetUrl}\n\nCe lien est valable 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.`,
  };
}

export function confirmationEmail(params: {
  prenom?: string;
  confirmUrl: string;
}): { subject: string; html: string; text: string } {
  const bonjour = params.prenom ? `Bonjour ${params.prenom} 👋` : "Bonjour 👋";
  const html = layout(`
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:${BRAND_DARK};">${bonjour}</h1>
    <p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:#334155;">
      Bienvenue sur <strong>AKADIA</strong> ! Il ne reste qu'une étape :
      confirmez votre adresse email pour activer votre compte.
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px auto;">
      <tr>
        <td style="border-radius:12px;background-color:${BRAND};">
          <a href="${params.confirmUrl}"
             style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:12px;">
            Confirmer mon email
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:${MUTED};">
      Ce lien est valable 24 heures. Si le bouton ne fonctionne pas, copiez-collez
      cette adresse dans votre navigateur :
    </p>
    <p style="margin:0 0 20px;font-size:12px;line-height:1.5;word-break:break-all;">
      <a href="${params.confirmUrl}" style="color:${BRAND};">${params.confirmUrl}</a>
    </p>
    <hr style="border:none;border-top:1px solid #e3e8f0;margin:0 0 16px;" />
    <p style="margin:0;font-size:12px;color:${MUTED};">
      Vous n'êtes pas à l'origine de cette inscription ? Ignorez simplement cet email.
    </p>
  `);

  return {
    subject: "Confirmez votre email — AKADIA",
    html,
    text: `${bonjour}\n\nBienvenue sur AKADIA ! Confirmez votre adresse email pour activer votre compte :\n${params.confirmUrl}\n\nCe lien est valable 24 heures. Si vous n'êtes pas à l'origine de cette inscription, ignorez cet email.`,
  };
}
