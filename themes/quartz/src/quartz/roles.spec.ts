import { describe, expect, it } from "vitest";

import { INKS, LINES, ROLES, SURFACES } from "#quartz/roles.ts";

describe("ROLES", () => {
  it("places a table for every hue Quartz draws", () => {
    expect(Object.keys(ROLES).toSorted()).toStrictEqual([
      "blue",
      "cyan",
      "gray",
      "green",
      "indigo",
      "orange",
      "pink",
      "purple",
      "red",
      "teal",
      "yellow",
    ]);
  });

  it("places the solid of blue where the gate accepts it", () => {
    expect(ROLES.blue.solid).toStrictEqual([80, 90]);
  });

  it("writes the text on a solid as a color the foundation names", () => {
    expect(ROLES.blue.contrast).toStrictEqual({
      value: { _dark: "{colors.gray.black}", base: "{colors.gray.white}" },
    });
  });

  it("places the page on the neutral ramp in both modes", () => {
    expect(SURFACES.DEFAULT).toStrictEqual(["white", 16]);
  });

  it("places the default ink and line", () => {
    expect(INKS.DEFAULT).toStrictEqual([14, "white"]);
    expect(LINES.DEFAULT).toStrictEqual([82, 40]);
  });
});
