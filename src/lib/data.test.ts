import { describe, expect, it } from "vitest";
import { formations, features, stats, faq, getFormation } from "./data";

describe("données de démonstration", () => {
  it("les slugs de formations sont uniques", () => {
    const slugs = formations.map((f) => f.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("les ids de formations sont uniques", () => {
    const ids = formations.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("chaque formation a un statut valide", () => {
    for (const f of formations) {
      expect(["publiee", "brouillon", "archivee"]).toContain(f.status);
    }
  });

  it("au moins 3 formations publiées (section « populaires » de la home)", () => {
    expect(formations.filter((f) => f.status === "publiee").length).toBeGreaterThanOrEqual(3);
  });

  it("getFormation retrouve une formation par slug", () => {
    const first = formations[0];
    expect(getFormation(first.slug)).toEqual(first);
    expect(getFormation("slug-inexistant")).toBeUndefined();
  });

  it("exactement 4 stats (la home associe une icône par index)", () => {
    expect(stats).toHaveLength(4);
  });

  it("chaque feature déclare une icône et un titre", () => {
    for (const f of features) {
      expect(f.icon).toBeTruthy();
      expect(f.titre).toBeTruthy();
    }
  });

  it("chaque entrée FAQ a question et réponse", () => {
    for (const item of faq) {
      expect(item.q).toBeTruthy();
      expect(item.r).toBeTruthy();
    }
  });
});
