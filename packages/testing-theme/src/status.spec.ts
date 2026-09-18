import { describe, expect, it } from "vitest";

import { defineTheme, paletteAlias } from "@stealthscale/theme/authoring";
import foundation from "@stealthscale/theme/theme";

import { THRESHOLDS } from "#contrast.ts";
import { distinct, statusDistance, statusPairs } from "#status.ts";
import { foundationTheme, paletteTheme } from "#theme.fixtures.ts";

/**
 * Draws the error palette from the same hue as the success palette.
 */
function alike(): ReturnType<typeof defineTheme> {
  return defineTheme({
    extends: foundationTheme(),
    name: "alike",
    semanticTokens: { colors: { error: paletteAlias("green") } },
  });
}

describe("status", () => {
  it("pairs every two statuses once on the solid and on the ink", () => {
    const pairs = statusPairs();

    expect(pairs).toHaveLength(12);
    expect(pairs[0]).toStrictEqual({ one: "info", other: "success", role: "solid" });
    expect(pairs.at(-1)).toStrictEqual({ one: "warning", other: "error", role: "fg" });
  });

  it("measures the distance between two statuses on one role in one mode", () => {
    const pair = { one: "success", other: "error", role: "solid" };

    expect(statusDistance(foundationTheme(), pair, "base", {})).toBeGreaterThan(0.2);
    expect(statusDistance(alike(), pair, "base", {})).toBe(0);
  });

  it("measures NaN where a status cannot be resolved", () => {
    const pair = { one: "success", other: "error", role: "solid" };

    expect(statusDistance(paletteTheme(), pair, "base", {})).toBeNaN();
  });

  it("passes the foundation on every pair of solids", () => {
    expect(distinct(foundationTheme(), {}, THRESHOLDS)).toStrictEqual([]);
  });

  it("reports two statuses drawn from one hue in both modes", () => {
    expect(distinct(alike(), {}, THRESHOLDS)).toStrictEqual([
      "alike success.solid and error.solid differ by 0.000 in base, below 0.05",
      "alike success.solid and error.solid differ by 0.000 in _dark, below 0.05",
    ]);
  });

  it("holds the solids to the distance it was handed", () => {
    expect(distinct(alike(), {}, { ...THRESHOLDS, status: 0 })).toStrictEqual([]);
  });

  it("reports a pair it cannot measure", () => {
    expect(distinct(paletteTheme(), { base: foundation }, THRESHOLDS)).toStrictEqual([]);
    expect(distinct(paletteTheme(), {}, THRESHOLDS)[0]).toBe(
      "audited info.solid and success.solid cannot be measured in base",
    );
  });
});
