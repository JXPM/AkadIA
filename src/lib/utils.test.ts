import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("fusionne des classes simples", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("ignore les valeurs falsy", () => {
    expect(cn("a", false && "b", undefined, null, "c")).toBe("a c");
  });

  it("résout les conflits Tailwind (la dernière gagne)", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("text-brand", "text-foreground")).toBe("text-foreground");
  });
});
