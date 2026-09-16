import { describe, expect, it } from "vitest";

import { COLOR_MODE_ATTRIBUTE, THEME_ATTRIBUTE } from "#attributes.ts";

describe("attributes", () => {
  it("names the theme attribute without naming the compiler", () => {
    expect(THEME_ATTRIBUTE).toBe("data-theme");
  });

  it("names the color mode attribute the same way as the theme", () => {
    expect(COLOR_MODE_ATTRIBUTE).toBe("data-color-mode");
  });
});
