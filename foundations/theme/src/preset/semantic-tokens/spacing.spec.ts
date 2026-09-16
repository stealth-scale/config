import { describe, expect, it } from "vitest";

import { spacing } from "#preset/semantic-tokens/spacing.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("spacing", () => {
  it("draws a medium inset at one rem", () => {
    expect(tokenAt(spacing, "inset.md")).toBe("1.0000rem");
  });

  it("draws a medium gap at half a rem", () => {
    expect(tokenAt(spacing, "gap.md")).toBe("0.5000rem");
  });
});
