import { describe, expect, it } from "vitest";

import { grid, spacing } from "#preset/tokens/spacing.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("spacing", () => {
  it("draws thirty-six steps of a quarter rem", () => {
    expect(Object.keys(spacing)).toHaveLength(36);
    expect(tokenAt(spacing, "1")).toBe("0.25rem");
    expect(tokenAt(spacing, "4")).toBe("1rem");
  });

  it("runs in halves up to six rem and then in larger jumps", () => {
    expect(spacing["0.5"]).toStrictEqual({ value: "0.125rem" });
    expect(spacing["5.5"]).toStrictEqual({ value: "1.375rem" });
    expect(spacing["6.5"]).toBeUndefined();
    expect(tokenAt(spacing, "96")).toBe("24rem");
  });

  it("starts at nought", () => {
    expect(tokenAt(spacing, "0")).toBe("0rem");
  });

  it("shares the grid with the sizes", () => {
    expect(spacing).toBe(grid);
  });
});
