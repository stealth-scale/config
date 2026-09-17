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

  it("drifts the aurora through the three quiet fills and back to the first", () => {
    expect(tokenAt(gradients, "aurora")).toMatch(
      /^linear-gradient\(120deg, \{colors\.primary\.subtle\} 0%, .*\{colors\.primary\.subtle\} 100%\)$/u,
    );
  });
});
