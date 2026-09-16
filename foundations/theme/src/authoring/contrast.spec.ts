import { describe, expect, it } from "vitest";

import { contrast, luminance, readable } from "#authoring/contrast.ts";

const WHITE = "oklch(100.0% 0.0000 0.0)";

const BLACK = "oklch(0.0% 0.0000 0.0)";

describe("contrast", () => {
  it("measures white as the top of the luminance scale", () => {
    expect(luminance(WHITE)).toBeCloseTo(1, 3);
  });

  it("measures black as the bottom of the luminance scale", () => {
    expect(luminance(BLACK)).toBeCloseTo(0, 3);
  });

  it.each([
    "oklch(100.0% 0.0000 0.0)",
    "oklch(1 0 0)",
    "#ffffff",
    "#fff",
    "rgb(255, 255, 255)",
    "rgb(255 255 255 / 1)",
  ])("reads white written as %s", (color) => {
    expect(luminance(color)).toBeCloseTo(1, 3);
  });

  it("reads a short hex as the pairs it stands for", () => {
    expect(luminance("#f00")).toBeCloseTo(luminance("#ff0000"), 6);
  });

  it("returns NaN for a color it has no reader for", () => {
    expect(luminance("rebeccapurple")).toBeNaN();
    expect(luminance("var(--colors-red-500)")).toBeNaN();
  });

  it("measures the widest pair as 21", () => {
    expect(contrast(WHITE, BLACK)).toBeCloseTo(21, 2);
  });

  it("measures a color against itself as 1", () => {
    expect(contrast(WHITE, WHITE)).toBeCloseTo(1, 4);
  });

  it("measures the same ratio whichever color is in front", () => {
    expect(contrast(WHITE, BLACK)).toBeCloseTo(contrast(BLACK, WHITE), 6);
  });

  it("returns NaN when either color cannot be read", () => {
    expect(contrast("rebeccapurple", WHITE)).toBeNaN();
  });

  it("measures the same pair however each color is written", () => {
    const target = contrast("#ef4444", "#ffffff");

    expect(contrast("rgb(239, 68, 68)", "oklch(100% 0 0)")).toBeCloseTo(target, 2);
    expect(contrast("#EF4444", "rgb(255 255 255)")).toBeCloseTo(target, 6);
  });

  it("agrees with the ratio WCAG publishes for grey on white", () => {
    expect(contrast("#767676", "#ffffff")).toBeCloseTo(4.54, 1);
  });

  it("holds a pair to the level it was asked for", () => {
    const mid = "oklch(52.0% 0.1862 258.0)";

    expect(readable(WHITE, mid)).toBe(true);
    expect(readable(WHITE, mid, "AAA")).toBe(false);
  });

  it("clears no level for a color that cannot be read", () => {
    expect(readable("rebeccapurple", WHITE)).toBe(false);
  });
});
