import { describe, expect, it } from "vitest";
import { confirmationEmail } from "./email-templates";

describe("confirmationEmail", () => {
  const url = "https://akadia-nine.vercel.app/auth/confirmer?token_hash=abc&next=%2Fapp%2Fdashboard";

  it("contient le lien de confirmation dans le HTML et le texte", () => {
    const mail = confirmationEmail({ prenom: "Marie", confirmUrl: url });
    expect(mail.html).toContain(url);
    expect(mail.text).toContain(url);
  });

  it("personnalise le message avec le prénom", () => {
    const mail = confirmationEmail({ prenom: "Marie", confirmUrl: url });
    expect(mail.html).toContain("Bonjour Marie");
    const anonyme = confirmationEmail({ confirmUrl: url });
    expect(anonyme.html).toContain("Bonjour 👋");
  });

  it("utilise la couleur de marque et le bouton d'action", () => {
    const mail = confirmationEmail({ confirmUrl: url });
    expect(mail.html).toContain("#2f6bff");
    expect(mail.html).toContain("Confirmer mon email");
  });

  it("a un sujet en français mentionnant AKADIA", () => {
    const mail = confirmationEmail({ confirmUrl: url });
    expect(mail.subject).toContain("AKADIA");
    expect(mail.subject).toContain("Confirmez");
  });
});
