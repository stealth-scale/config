import { describe, expect, it } from "vitest";

import { gradients } from "#preset/semantic-tokens/gradients.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("gradients", () => {
  it("names the brand sweep and the shine and the aurora", () => {
    expect(Object.keys(gradients).toSorted()).toStrictEqual(["aurora", "brand", "shine"]);
  });

  it("draws the brand sweep from the primary solid to the accent solid", () => {
    expect(tokenAt(gradients, "brand")).toBe(
      "linear-gradient(to right, {colors.primary.solid}, {colors.accent.solid})",
    );
  });

  it("draws the shine as a band of white across a transparent field", () => {
    expect(tokenAt(gradients, "shine")).toContain("{colors.whiteAlpha.500} 50%");
    expect(tokenAt(gradients, "shine")).toMatch(/^linear-gradient\(105deg, transparent 40%/u);
  });

  it("drifts the aurora through the three palettes and alternates two fills of each", () => {
    expect(tokenAt(gradients, "aurora")).toBe(
      "linear-gradient(120deg, {colors.primary.emphasized} 0%, {colors.accent.muted} 35%, {colors.secondary.emphasized} 70%, {colors.primary.muted} 100%)",
    );
  });
});
