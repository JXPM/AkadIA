import { describe, expect, it } from "vitest";
import {
  QUESTION_DUREE_S,
  calculerPoints,
  genererCode,
  normaliserCode,
} from "./live-utils";

describe("genererCode", () => {
  it("produit 6 caractères sans symboles ambigus (0, O, 1, I, L)", () => {
    for (let i = 0; i < 50; i++) {
      const code = genererCode();
      expect(code).toHaveLength(6);
      expect(code).toMatch(/^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]+$/);
    }
  });
});

describe("normaliserCode", () => {
  it("nettoie espaces, casse et caractères parasites", () => {
    expect(normaliserCode(" 7k3f9q ")).toBe("7K3F9Q");
    expect(normaliserCode("7K-3F 9Q")).toBe("7K3F9Q");
  });
});

describe("calculerPoints", () => {
  it("0 point pour une mauvaise réponse", () => {
    expect(calculerPoints(false, 0)).toBe(0);
  });

  it("200 points pour une réponse instantanée, 100 au bout du temps", () => {
    expect(calculerPoints(true, 0)).toBe(200);
    expect(calculerPoints(true, QUESTION_DUREE_S * 1000)).toBe(100);
  });

  it("le bonus décroît avec le temps et ne devient jamais négatif", () => {
    const rapide = calculerPoints(true, 3_000);
    const lent = calculerPoints(true, 25_000);
    expect(rapide).toBeGreaterThan(lent);
    expect(calculerPoints(true, 120_000)).toBe(100);
  });
});
