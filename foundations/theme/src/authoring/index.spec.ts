import { describe, expect, it } from "vitest";

import * as published from "#authoring/index.ts";

const SURFACE = [
  "absoluteCenter",
  "alphaScale",
  "BACKGROUNDS",
  "backgrounds",
  "BORDERS",
  "borders",
  "center",
  "cluster",
  "colorScale",
  "contract",
  "contrast",
  "controls",
  "controlSizes",
  "cover",
  "deepMerge",
  "definePreset",
  "defineRecipe",
  "defineSlotRecipe",
  "defineStyles",
  "defineTheme",
  "dense",
  "divider",
  "field",
  "flex",
  "floating",
  "fontSizes",
  "FOREGROUNDS",
  "foregrounds",
  "frame",
  "gaps",
  "grid",
  "hstack",
  "HUES",
  "iconOnly",
  "icons",
  "iconSizes",
  "insets",
  "interactive",
  "link",
  "LOOKS",
  "lookVariants",
  "luminance",
  "MODES",
  "motion",
  "neutralFills",
  "oklch",
  "overlay",
  "paletteAlias",
  "paletteRoles",
  "PALETTES",
  "radii",
  "readable",
  "reel",
  "responsive",
  "ROLES",
  "scrollable",
  "shadows",
  "sidebar",
  "simpleGrid",
  "slides",
  "slotsOf",
  "stack",
  "STATUSES",
  "statusVariants",
  "surface",
  "switcher",
  "touchTarget",
  "typography",
  "visuallyHidden",
  "vstack",
];

describe("authoring", () => {
  it("publishes the vocabulary a recipe and a theme are written in", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(SURFACE.toSorted());
  });

  it("publishes nothing from the generated runtime", () => {
    expect(Object.keys(published)).not.toContain("css");
    expect(Object.keys(published)).not.toContain("styled");
  });
});
