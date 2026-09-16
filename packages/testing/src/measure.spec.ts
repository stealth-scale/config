/**
 * Covers the length reader and the edge-to-edge measurement.
 *
 * @remarks
 *   No element is rendered. The rectangles are stated outright, which is the only way to assert a
 *   given overlap under a test runner that lays nothing out.
 */

import { describe, expect, it } from "vitest";

import { type Measured, pixels, seamBetween } from "#measure.ts";

/**
 * Stands in for an element that reports the two edges it is given.
 *
 * @remarks
 *   The same numbers come back on every call, so a measurement reads what the spec stated rather
 *   than what a layout engine would compute.
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
