import { describe, expect, it } from "vitest";

import { interactive, link } from "#authoring/recipes/interactive.ts";

describe("interactive", () => {
  it("draws the hand and a fast transition of the common properties", () => {
    expect(interactive()).toMatchObject({
      cursor: "button",
      transitionDuration: "fast",
      transitionProperty: "common",
      transitionTimingFunction: "out",
      userSelect: "none",
    });
  });

  it("draws the focus ring outside the box in the palette's ring color", () => {
    expect(interactive()).toMatchObject({
      focusRingColor: "colorPalette.focusRing",
      focusVisibleRing: "outside",
    });
  });

  it("reads the disabled look when disabled", () => {
    expect(interactive()).toMatchObject({ _disabled: { layerStyle: "disabled" } });
  });

  it("draws a link in the link ink with an underline on hover", () => {
    expect(link()).toMatchObject({
      _hover: { textDecoration: "underline", textUnderlineOffset: "normal" },
      color: "fg.link",
      textDecoration: "none",
    });
  });

  it("keeps the link ink once visited", () => {
    expect(link()).toMatchObject({ _visited: { color: "fg.link" } });
  });
});
