import { describe, expect, it } from "vitest";

import foundation from "@stealthscale/theme/theme";

import { boundary, focus, text, THRESHOLDS } from "#contrast.ts";
import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";

const BASE = { base: foundation };

describe("contrast", () => {
  it("passes the foundation on every pair", () => {
    const theme = foundationTheme();

    expect(text(theme, {}, THRESHOLDS)).toStrictEqual([]);
    expect(boundary(theme, {}, THRESHOLDS)).toStrictEqual([]);
    expect(focus(theme, {}, THRESHOLDS)).toStrictEqual([]);
  });

  it("passes a palette drawn from its ramp over the foundation's surfaces", () => {
    const theme = paletteTheme();

    expect(text(theme, BASE, THRESHOLDS)).toStrictEqual([]);
    expect(boundary(theme, BASE, THRESHOLDS)).toStrictEqual([]);
    expect(focus(theme, BASE, THRESHOLDS)).toStrictEqual([]);
  });

  it("reports a text pair below the text ratio with what it measured", () => {
    const theme = paletteTheme({ contrast: { value: "{colors.primary.600}" } });

    expect(text(theme, BASE, THRESHOLDS)).toStrictEqual([
      "audited primary.contrast on primary.solid measures 1.53 in base, below 7",
      "audited primary.contrast on primary.solid.hover measures 2.13 in base, below 7",
      "audited primary.contrast on primary.solid measures 2.78 in _dark, below 7",
      "audited primary.contrast on primary.solid.hover measures 3.71 in _dark, below 7",
    ]);
  });

  it("reports a pair it cannot measure", () => {
    const theme = paletteTheme({ solid: { value: "{colors.primary.999}" } });

    expect(text(theme, BASE, THRESHOLDS)[0]).toBe(
      "audited primary.contrast on primary.solid cannot be measured in base, below 7",
    );
  });

  it("reports a line below the boundary ratio", () => {
    const theme = paletteTheme({
      border: {
        DEFAULT: { value: "{colors.primary.100}" },
        hover: { value: "{colors.primary.500}" },
      },
    });

    expect(boundary(theme, BASE, THRESHOLDS)).toStrictEqual([
      "audited primary.border on bg measures 1.09 in base, below 3",
    ]);
  });

  it("reports a ring below the focus ratio on a surface", () => {
    const theme = paletteTheme({ focusRing: { value: "{colors.primary.300}" } });

    expect(focus(theme, BASE, THRESHOLDS)).toHaveLength(6);
    expect(focus(theme, BASE, THRESHOLDS)[0]).toContain("primary.focusRing on bg measures");
  });

  it("holds a pair to the ratio it was handed", () => {
    const theme = paletteTheme({ contrast: { value: "{colors.primary.600}" } });

    expect(text(theme, BASE, { ...THRESHOLDS, text: 1.5 })).toStrictEqual([]);
  });

  it("reports the surfaces the foundation leaves unresolved without a base", () => {
    expect(text(paletteTheme(), {}, THRESHOLDS)[0]).toContain("cannot be measured");
  });
});
