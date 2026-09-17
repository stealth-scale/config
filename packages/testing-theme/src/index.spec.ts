import { describe, expect, expectTypeOf, it } from "vitest";

import { type Application, type Theme } from "@stealthscale/theme/authoring";
import {
  type Theme as Loaded,
  type Application as Stated,
  type Switchable,
} from "@stealthscale/vite-plugin-theme";

import * as published from "#index.ts";

const SURFACE = [
  "axesOf",
  "byStep",
  "classesOf",
  "defaultsOf",
  "extendedRecipes",
  "fontsOf",
  "palettesOf",
  "presetViolations",
  "recipeClass",
  "recipeClasses",
  "recipeElement",
  "recipeViolations",
  "resolved",
  "scaleOf",
  "slotClass",
  "slotClasses",
  "slotElement",
  "slotVariantClass",
  "slotsOf",
  "THRESHOLDS",
  "valuesOf",
  "variantClass",
  "violations",
];

describe("testing-theme", () => {
  it("publishes the three gates and the readers", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(SURFACE.toSorted());
  });

  it("agrees with the build plugin on what a theme and an application are", () => {
    expect(published.THRESHOLDS.text).toBe(7);

    expectTypeOf<Theme>().toExtend<Switchable>();
    expectTypeOf<Theme>().toExtend<Loaded>();
    expectTypeOf<Application>().toExtend<Stated>();
  });
});
