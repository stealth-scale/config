import { describe, expect, it } from "vitest";

import { tokens } from "#preset/tokens/index.ts";

describe("tokens", () => {
  it("fills every category the compiler reads", () => {
    expect(Object.keys(tokens).toSorted()).toStrictEqual([
      "animations",
      "aspectRatios",
      "blurs",
      "borderWidths",
      "borders",
      "colors",
      "cursor",
      "durations",
      "easings",
      "fontSizes",
      "fontWeights",
      "fonts",
      "letterSpacings",
      "lineHeights",
      "opacity",
      "radii",
      "sizes",
      "spacing",
      "zIndex",
    ]);
  });
});
