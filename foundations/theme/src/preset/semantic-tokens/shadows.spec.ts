import { describe, expect, it } from "vitest";

import { shadows } from "#preset/semantic-tokens/shadows.ts";
import { modedAt } from "#tokens.fixtures.ts";

describe("shadows", () => {
  it("tints every shadow with the grey ramp's hue", () => {
    expect(modedAt(shadows, "md", "base")).toContain("0.02 262");
  });

  it("draws eight shadows", () => {
    expect(Object.keys(shadows)).toHaveLength(8);
  });
});
