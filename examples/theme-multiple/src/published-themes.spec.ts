import { describe, expect, it } from "vitest";

import { publishedThemes } from "#published-themes.ts";

describe("publishedThemes", () => {
  it("lists each root before the variants derived from it", () => {
    expect(publishedThemes.map((each) => each.name)).toStrictEqual([
      "graphite",
      "graphite-dimmed",
      "graphite-contrast",
      "steel",
      "steel-gray",
      "compass",
      "compass-contrast",
      "quartz",
      "asphalt",
      "pebble",
      "lantern",
      "prism",
    ]);
  });

  it("nests a variant's parent preset beneath its own", () => {
    expect(publishedThemes[1]?.preset.presets).toStrictEqual([publishedThemes[0]?.preset]);
  });
});
