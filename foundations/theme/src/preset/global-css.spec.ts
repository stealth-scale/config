import { describe, expect, it } from "vitest";

import { globalCss } from "#preset/global-css.ts";

describe("globalCss", () => {
  it("fills the six properties the reset and the focus ring read", () => {
    expect(globalCss[":root"]).toStrictEqual({
      "--global-color-border": "colors.border",
      "--global-color-focus-ring": "colors.border.focus",
      "--global-color-placeholder": "colors.fg.muted",
      "--global-color-selection": "colors.neutral.emphasized",
      "--global-font-body": "fonts.body",
      "--global-font-mono": "fonts.mono",
    });
  });

  it("draws the page in its own ink and surface with the neutral palette", () => {
    expect(globalCss["html"]).toMatchObject({
      background: "bg",
      color: "fg",
      colorPalette: "neutral",
      colorScheme: "light",
    });
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
