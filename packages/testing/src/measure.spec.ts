import { describe, expect, it } from "vitest";

import { type Measured, pixels, seamBetween } from "#measure.ts";

/**
 * Builds an element that reports the box a case is about.
 *
 * @param left - The box's left edge.
 * @param right - Its right edge.
 * @returns An element reporting exactly that box.
 */
function boxed(left: number, right: number): Measured {
  return { getBoundingClientRect: () => ({ left, right }) };
}

describe("pixels", () => {
  it("returns the number in front of the unit", () => {
    expect(pixels("16px")).toBe(16);
    expect(pixels("0.5rem")).toBe(0.5);
  });

  it("returns a negative length", () => {
    expect(pixels("-4px")).toBe(-4);
  });

  it("returns 0 for a length with no number", () => {
    expect(pixels("auto")).toBe(0);
    expect(pixels("")).toBe(0);
  });
});

describe("seamBetween", () => {
  it("returns 0 when the two share an edge", () => {
    expect(seamBetween(boxed(0, 80), boxed(80, 160))).toBe(0);
  });

  it("returns the gap between them", () => {
    expect(seamBetween(boxed(0, 80), boxed(92, 160))).toBe(12);
  });

  it("returns a positive distance when the two overlap", () => {
    expect(seamBetween(boxed(0, 80), boxed(72, 160))).toBe(8);
  });
});
