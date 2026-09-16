import { describe, expect, it } from "vitest";

import { borders, borderWidths } from "#preset/tokens/border-widths.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("borderWidths", () => {
  it("weighs every line above the hairline in whole pixels", () => {
    for (const name of ["sm", "md", "lg", "xl"]) {
      expect(String(tokenAt(borderWidths, name))).toMatch(/^\d+px$/u);
    }
  });

  it("draws the hairline at half a pixel and none at nought", () => {
    expect(tokenAt(borderWidths, "xs")).toBe("0.5px");
    expect(tokenAt(borderWidths, "none")).toBe("0");
  });

  it("derives every shorthand from its width", () => {
    for (const name of ["xs", "sm", "md", "lg", "xl"]) {
      expect(tokenAt(borders, name)).toBe(`{borderWidths.${name}} solid`);
    }
  });

  it("writes the none shorthand as none", () => {
    expect(tokenAt(borders, "none")).toBe("none");
  });
});
