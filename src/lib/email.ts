import nodemailer from "nodemailer";

// Envoi d'emails transactionnels via SMTP (Gmail, Resend, Brevo, OVH…).
// Variables requises : SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, EMAIL_FROM.
// Sans configuration SMTP, l'email n'est pas envoyé : le lien est loggé côté
// serveur (pratique en dev) et sendEmail renvoie { sent: false }.

export function isEmailEnabled(): boolean {
  return !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ sent: boolean; error?: string }> {
  if (!isEmailEnabled()) {
    console.warn(
      `[email] SMTP non configuré — email « ${options.subject} » pour ${options.to} non envoyé.`
    );
    return { sent: false, error: "SMTP non configuré" };
  }

  const port = Number(process.env.SMTP_PORT ?? 465);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? `AKADIA <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return { sent: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[email] Échec d'envoi :", message);
    return { sent: false, error: message };
  }
}
