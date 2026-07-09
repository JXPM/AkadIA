import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { LordIcon, lordIcons } from "./lord-icon";

describe("LordIcon", () => {
  it("rend l'élément <lord-icon> avec la bonne source CDN", () => {
    const { container } = render(<LordIcon icon="livre" />);
    const el = container.querySelector("lord-icon");
    expect(el).not.toBeNull();
    expect(el?.getAttribute("src")).toBe(lordIcons.livre);
  });

  it("applique trigger, target et taille", () => {
    const { container } = render(
      <LordIcon icon="coche" size={32} trigger="loop-on-hover" target=".group" />
    );
    const el = container.querySelector("lord-icon");
    expect(el?.getAttribute("trigger")).toBe("loop-on-hover");
    expect(el?.getAttribute("target")).toBe(".group");
    expect((el as HTMLElement).style.width).toBe("32px");
    expect((el as HTMLElement).style.height).toBe("32px");
  });

  it("applique la palette de marque par défaut", () => {
    const { container } = render(<LordIcon icon="video" />);
    const el = container.querySelector("lord-icon");
    expect(el?.getAttribute("colors")).toContain("primary:#2f6bff");
  });

  it("toutes les URLs du registre pointent vers le CDN Lordicon", () => {
    for (const url of Object.values(lordIcons)) {
      expect(url).toMatch(/^https:\/\/cdn\.lordicon\.com\/[a-z]+\.json$/);
    }
  });
});
