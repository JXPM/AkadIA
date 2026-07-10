import { afterEach, describe, expect, it, vi } from "vitest";
import { aiEnabled } from "./ai";

describe("aiEnabled", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("désactivé sans clé", () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "");
    expect(aiEnabled()).toBe(false);
  });

  it("désactivé avec une clé placeholder", () => {
    for (const placeholder of ["your-ai-gateway-key", "your_key", "changeme", "xxx"]) {
      vi.stubEnv("AI_GATEWAY_API_KEY", placeholder);
      expect(aiEnabled()).toBe(false);
    }
  });

  it("activé avec une vraie clé", () => {
    vi.stubEnv("AI_GATEWAY_API_KEY", "vck_1234567890abcdef");
    expect(aiEnabled()).toBe(true);
  });
});
