import { describe, expect, it } from "vitest";

import { PALETTE, stylesheet, TOKEN_EXPORTS } from "#palette.ts";

describe("palette", () => {
  it("writes every token it defines", () => {
    for (const token of Object.keys(PALETTE)) {
      expect(stylesheet()).toContain(token);
    }
  });

  it("writes them where a browser reads a custom property from", () => {
    expect(stylesheet().startsWith(":root {")).toBe(true);
  });

  it("writes the colour beside the token", () => {
    expect(stylesheet()).toContain("--ink: #1a1a1a;");
  });

  it("names the stylesheet it writes", () => {
    expect(Object.values(TOKEN_EXPORTS)).toContain("./dist/tokens.css");
  });
});
