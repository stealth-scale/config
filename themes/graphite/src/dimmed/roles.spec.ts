import { describe, expect, it } from "vitest";

import { INKS, LINES, ROLES, SURFACES } from "#dimmed/roles.ts";

describe("ROLES", () => {
  it("places a table for every hue Graphite draws", () => {
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
    expect(ROLES.blue.solid).toStrictEqual([5, 4]);
  });

  it("writes the text on a solid as a color the foundation names", () => {
    expect(ROLES.blue.contrast).toStrictEqual({
      value: { _dark: "{colors.gray.dark.0}", base: "{colors.gray.0}" },
    });
  });

  it("places the page on the neutral ramp in both modes", () => {
    expect(SURFACES.DEFAULT).toStrictEqual([0, 3]);
  });

  it("places the default ink and line", () => {
    expect(INKS.DEFAULT).toStrictEqual([13, 11]);
    expect(LINES.DEFAULT).toStrictEqual([6, 7]);
  });
});
