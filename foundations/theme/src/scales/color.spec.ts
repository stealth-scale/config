import { describe, expect, it } from "vitest";

import { HUES, ROLES } from "#authoring/contract.ts";
import {
  alphaScale,
  backgrounds,
  borders,
  colorScale,
  foregrounds,
  neutralFills,
  oklch,
  paletteAlias,
  paletteRoles,
} from "#scales/color.ts";
import { modedAt, tokenAt } from "#tokens.fixtures.ts";

const STEPS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];

function chromaOf(color: string): number {
  return Number(/oklch\([\d.]+% (?<chroma>[\d.]+) /u.exec(color)?.groups?.["chroma"]);
}

describe("color", () => {
  it("writes a color the way CSS reads one", () => {
    expect(oklch(60, 0.1, 262)).toBe("oklch(60.0% 0.1000 262.0)");
  });

  it("rounds each part of a color to the precision a stylesheet needs", () => {
    expect(oklch(60.049, 0.100_049, 262.049)).toBe("oklch(60.0% 0.1000 262.0)");
  });

  it("draws eleven steps from the lightest to the darkest", () => {
    expect(Object.keys(colorScale(262, 0.14))).toStrictEqual(STEPS);
  });

  it("draws every step in the hue it was given", () => {
    expect(tokenAt(colorScale(262, 0.14), "500")).toContain("262.0");
    expect(tokenAt(colorScale(262, 0.14), "50")).toContain("262.0");
  });

  it("holds a near-grey ramp at its stated chroma at both ends", () => {
    const grey = colorScale(262, 0.008);

    expect(chromaOf(String(tokenAt(grey, "50"))) / 0.008).toBeGreaterThan(0.9);
    expect(chromaOf(String(tokenAt(grey, "950"))) / 0.008).toBeGreaterThan(0.9);
  });

  it("lets a saturated ramp fall away at both ends", () => {
    const blue = colorScale(262, 0.14);

    expect(chromaOf(String(tokenAt(blue, "500")))).toBeCloseTo(0.14, 3);
    expect(chromaOf(String(tokenAt(blue, "50"))) / 0.14).toBeLessThan(0.25);
    expect(chromaOf(String(tokenAt(blue, "950"))) / 0.14).toBeLessThan(0.5);
  });

  it("draws an alpha ramp from faint to nearly opaque", () => {
    expect(Object.keys(alphaScale("white"))).toStrictEqual(STEPS);
    expect(tokenAt(alphaScale("white"), "50")).toBe("oklch(100% 0 0 / 0.04)");
    expect(tokenAt(alphaScale("black"), "950")).toBe("oklch(0% 0 0 / 0.95)");
  });

  it("names every surface a page is built from", () => {
    expect(Object.keys(backgrounds({ dark: 13, light: 97 }, 262, 0.006)).toSorted()).toStrictEqual([
      "DEFAULT",
      "backdrop",
      "disabled",
      "emphasized",
      "error",
      "info",
      "inverted",
      "muted",
      "panel",
      "popover",
      "subtle",
      "success",
      "warning",
    ]);
  });

  it("draws the page at the lightness it was given in each mode", () => {
    const surfaces = backgrounds({ dark: 13, light: 97 }, 262, 0.006);

    expect(modedAt(surfaces, "DEFAULT", "base")).toContain("97.0%");
    expect(modedAt(surfaces, "DEFAULT", "_dark")).toContain("13.0%");
  });

  it("draws a surface away from the page in both modes", () => {
    const surfaces = backgrounds({ dark: 13, light: 97 }, 262, 0.006);

    expect(modedAt(surfaces, "muted", "_dark")).toContain("20.0%");
    expect(modedAt(surfaces, "muted", "base")).toContain("90.0%");
  });

  it("draws the inverted surface at the other mode's page", () => {
    const surfaces = backgrounds({ dark: 13, light: 97 }, 262, 0.006);

    expect(modedAt(surfaces, "inverted", "base")).toContain("13.0%");
    expect(modedAt(surfaces, "inverted", "_dark")).toContain("97.0%");
  });

  it("stops at white or black rather than wrapping", () => {
    const surfaces = backgrounds({ dark: 2, light: 99 }, 262, 0.006);

    expect(modedAt(surfaces, "emphasized", "base")).toContain("88.0%");
    expect(modedAt(surfaces, "emphasized", "_dark")).toContain("13.0%");
  });

  it("references the status palettes for the status surfaces", () => {
    expect(tokenAt(backgrounds({ dark: 13, light: 97 }, 262, 0.006), "error")).toBe(
      "{colors.error.subtle}",
    );
  });

  it("names every ink a page is written in", () => {
    expect(Object.keys(foregrounds()).toSorted()).toStrictEqual([
      "DEFAULT",
      "disabled",
      "error",
      "info",
      "inverted",
      "link",
      "muted",
      "subtle",
      "success",
      "warning",
    ]);
  });

  it("reads the grey ramp for the inks unless told otherwise", () => {
    expect(modedAt(foregrounds(), "DEFAULT", "base")).toBe("{colors.gray.950}");
    expect(modedAt(foregrounds("slate"), "DEFAULT", "base")).toBe("{colors.slate.950}");
  });

  it("inverts each ink between modes", () => {
    expect(modedAt(foregrounds(), "DEFAULT", "_dark")).toBe("{colors.gray.50}");
    expect(modedAt(foregrounds(), "muted", "base")).toBe("{colors.gray.800}");
    expect(modedAt(foregrounds(), "muted", "_dark")).toBe("{colors.gray.300}");
  });

  it("references the primary palette for the link ink", () => {
    expect(tokenAt(foregrounds(), "link")).toBe("{colors.primary.fg}");
  });

  it("names every line between things", () => {
    expect(Object.keys(borders()).toSorted()).toStrictEqual([
      "DEFAULT",
      "emphasized",
      "error",
      "focus",
      "info",
      "inverted",
      "muted",
      "subtle",
      "success",
      "warning",
    ]);
  });

  it("draws a muted line closer to the page than the default", () => {
    expect(modedAt(borders(), "muted", "base")).toBe("{colors.gray.200}");
    expect(modedAt(borders(), "DEFAULT", "base")).toBe("{colors.gray.300}");
  });

  it("references the primary palette's ring for the focus line", () => {
    expect(tokenAt(borders(), "focus")).toBe("{colors.primary.focusRing}");
  });

  it("fills every role of a hue palette", () => {
    const palette = paletteRoles("blue");

    expect(ROLES.every((role) => tokenAt(palette, role) !== undefined)).toBe(true);
  });

  it("nests a dotted role under its group", () => {
    expect(modedAt(paletteRoles("blue"), "solid.hover", "base")).toBe("{colors.blue.800}");
    expect(modedAt(paletteRoles("blue"), "solid.DEFAULT", "base")).toBe("{colors.blue.700}");
  });

  it("draws every role of a hue palette from the ramp it was named", () => {
    expect(modedAt(paletteRoles("teal"), "fg.DEFAULT", "_dark")).toBe("{colors.teal.50}");
  });

  it("fills every role of a semantic palette by reference to a hue", () => {
    const palette = paletteAlias("teal");

    expect(tokenAt(palette, "solid.DEFAULT")).toBe("{colors.teal.solid}");
    expect(tokenAt(palette, "solid.hover")).toBe("{colors.teal.solid.hover}");
    expect(ROLES.every((role) => tokenAt(palette, role) !== undefined)).toBe(true);
  });

  it("points the neutral fills at the page's own surfaces", () => {
    expect(neutralFills()).toStrictEqual({
      emphasized: { value: "{colors.bg.emphasized}" },
      muted: { value: "{colors.bg.muted}" },
      subtle: { value: "{colors.bg.subtle}" },
    });
  });

  it("draws a palette for every hue the contract lists", () => {
    expect(HUES.map((hue) => Object.keys(paletteRoles(hue)).length)).toStrictEqual(
      HUES.map(() => 9),
    );
  });
});
