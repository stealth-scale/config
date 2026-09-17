import { describe, expect, it } from "vitest";

import { globalCss, SWITCHED } from "#preset/global-css.ts";

describe("globalCss", () => {
  it("selects the root and every element that switches a theme or a mode", () => {
    expect(SWITCHED).toBe(":root, [data-theme], [data-color-mode]");
  });

  it("fills the six properties the reset and the focus ring read on every switched element", () => {
    expect(globalCss[SWITCHED]).toMatchObject({
      "--global-color-border": "colors.border",
      "--global-color-focus-ring": "colors.border.focus",
      "--global-color-placeholder": "colors.fg.muted",
      "--global-color-selection": "colors.neutral.emphasized",
      "--global-font-body": "fonts.body",
      "--global-font-mono": "fonts.mono",
    });
  });

  it("declares the ink and the palette and the font again on every switched element", () => {
    expect(globalCss[SWITCHED]).toMatchObject({
      color: "fg",
      colorPalette: "neutral",
      fontFamily: "body",
    });
  });

  it("draws the page on its own surface in the light scheme", () => {
    expect(globalCss["html"]).toMatchObject({ background: "bg", colorScheme: "light" });
  });

  it("follows the dark mode attribute with the color scheme", () => {
    expect(globalCss["[data-color-mode=dark]"]).toStrictEqual({ colorScheme: "dark" });
  });

  it("follows the light mode attribute with the color scheme", () => {
    expect(globalCss["[data-color-mode=light]"]).toStrictEqual({ colorScheme: "light" });
  });

  it("scrolls smoothly and jumps for a reader who asked for less motion", () => {
    expect(globalCss["html"]).toMatchObject({
      "@media (prefers-reduced-motion: reduce)": { scrollBehavior: "auto" },
      scrollBehavior: "smooth",
    });
  });

  it("follows the dark preference with the color scheme where the page writes no light mode", () => {
    expect(globalCss["html"]).toMatchObject({
      "@media (prefers-color-scheme: dark)": {
        "&:not([data-color-mode=light])": { colorScheme: "dark" },
      },
    });
  });
});
