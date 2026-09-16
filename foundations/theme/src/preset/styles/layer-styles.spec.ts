import { describe, expect, it } from "vitest";

import { layerStyles } from "#preset/styles/layer-styles.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("layerStyles", () => {
  it("names six fills and two outlines and four indicators", () => {
    expect(Object.keys(tokenAt(layerStyles, "fill") ?? {}).toSorted()).toStrictEqual([
      "ghost",
      "muted",
      "plain",
      "solid",
      "subtle",
      "surface",
    ]);
    expect(Object.keys(tokenAt(layerStyles, "outline") ?? {}).toSorted()).toStrictEqual([
      "solid",
      "subtle",
    ]);
    expect(Object.keys(tokenAt(layerStyles, "indicator") ?? {}).toSorted()).toStrictEqual([
      "bottom",
      "end",
      "start",
      "top",
    ]);
  });

  it("draws a solid fill in the palette with its hover inside it", () => {
    expect(tokenAt(layerStyles, "fill.solid")).toStrictEqual({
      _hover: { background: "colorPalette.solid.hover" },
      background: "colorPalette.solid",
      color: "colorPalette.contrast",
    });
  });

  it("draws a surface as a subtle fill with a border", () => {
    expect(tokenAt(layerStyles, "fill.surface")).toMatchObject({
      background: "colorPalette.subtle",
      borderColor: "colorPalette.border",
      borderWidth: "sm",
    });
  });

  it("draws a plain look as the ink alone", () => {
    expect(tokenAt(layerStyles, "fill.plain")).toStrictEqual({ color: "colorPalette.fg" });
  });

  it("draws an outline in the palette's solid or its border", () => {
    expect(tokenAt(layerStyles, "outline.solid")).toMatchObject({
      borderColor: "colorPalette.solid",
    });
    expect(tokenAt(layerStyles, "outline.subtle")).toMatchObject({
      _hover: { borderColor: "colorPalette.border.hover" },
      borderColor: "colorPalette.border",
    });
  });

  it("draws an indicator as a bar along one edge", () => {
    expect(tokenAt(layerStyles, "indicator.bottom")).toStrictEqual({
      _before: {
        background: "colorPalette.solid",
        bottom: "0",
        content: '""',
        height: "{borderWidths.md}",
        insetInline: "0",
        position: "absolute",
      },
      position: "relative",
    });
    expect(tokenAt(layerStyles, "indicator.start")).toMatchObject({
      _before: { insetBlock: "0", insetInlineStart: "0", width: "{borderWidths.md}" },
    });
  });

  it("draws a disabled control with the disabled cursor and opacity", () => {
    expect(tokenAt(layerStyles, "disabled")).toStrictEqual({
      cursor: "disabled",
      opacity: "disabled",
    });
  });
});
