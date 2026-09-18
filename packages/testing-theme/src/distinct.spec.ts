import { describe, expect, it } from "vitest";

import foundation from "@stealthscale/theme/theme";

import { THRESHOLDS } from "#contrast.ts";
import { fills, inks, lines, surfaces } from "#distinct.ts";
import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";

const BASE = { base: foundation };

describe("distinct", () => {
  it("passes the foundation on every consecutive step of the page", () => {
    const theme = foundationTheme();

    expect(surfaces(theme, {}, THRESHOLDS)).toStrictEqual([]);
    expect(inks(theme, {}, THRESHOLDS)).toStrictEqual([]);
    expect(lines(theme, {}, THRESHOLDS)).toStrictEqual([]);
  });

  it("passes a palette drawn from its ramp on every pair of steps", () => {
    expect(fills(paletteTheme(), BASE, THRESHOLDS)).toStrictEqual([]);
  });

  it("reports a hovered solid on the same step as the solid in both modes", () => {
    const theme = paletteTheme({
      solid: {
        DEFAULT: { value: { _dark: "{colors.primary.400}", base: "{colors.primary.700}" } },
        hover: { value: { _dark: "{colors.primary.400}", base: "{colors.primary.700}" } },
      },
    });

    expect(fills(theme, BASE, THRESHOLDS)).toStrictEqual([
      "audited primary.solid and primary.solid.hover differ by 0.000 in base, below 0.01",
      "audited primary.solid and primary.solid.hover differ by 0.000 in _dark, below 0.01",
    ]);
  });

  it("reports two fills closer than the distance with what it measured", () => {
    const theme = paletteTheme({ muted: { value: "oklch(94.5% 0.02 262)" } });

    expect(fills(theme, BASE, THRESHOLDS)).toStrictEqual([
      "audited primary.subtle and primary.muted differ by 0.005 in base, below 0.01",
    ]);
  });

  it("holds the steps to the distance it was handed", () => {
    const theme = paletteTheme({ muted: { value: "oklch(94.5% 0.02 262)" } });

    expect(fills(theme, BASE, { ...THRESHOLDS, distinct: 0.001 })).toStrictEqual([]);
  });

  it("reports a surface it cannot measure without a base", () => {
    expect(surfaces(paletteTheme(), {}, THRESHOLDS)[0]).toBe(
      "audited bg and bg.subtle cannot be measured in base",
    );
  });

  it("reports an ink whose step nothing defines", () => {
    const theme = paletteTheme({ fg: { value: "{colors.primary.999}" } });

    expect(fills(theme, BASE, THRESHOLDS)).toStrictEqual([
      "audited primary.fg and primary.fg.muted cannot be measured in base",
      "audited primary.fg and primary.fg.muted cannot be measured in _dark",
    ]);
  });
});
