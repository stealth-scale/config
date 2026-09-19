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

  it("names three glows and nine backdrops and two gradient texts", () => {
    expect(Object.keys(tokenAt(layerStyles, "glow") ?? {}).toSorted()).toStrictEqual([
      "lg",
      "md",
      "sm",
    ]);
    expect(Object.keys(tokenAt(layerStyles, "backdrop") ?? {}).toSorted()).toStrictEqual([
      "aurora",
      "checker",
      "dots",
      "grid",
      "noise",
      "spotlight",
      "stars",
      "stripes",
      "vignette",
    ]);
    expect(Object.keys(tokenAt(layerStyles, "text") ?? {}).toSorted()).toStrictEqual([
      "gradient",
      "shine",
    ]);
  });

  it("names three blurs and three masks and the dimming and the ripple", () => {
    expect(Object.keys(tokenAt(layerStyles, "blur") ?? {}).toSorted()).toStrictEqual([
      "lg",
      "md",
      "sm",
    ]);
    expect(Object.keys(tokenAt(layerStyles, "mask") ?? {}).toSorted()).toStrictEqual([
      "bottom",
      "edges",
      "radial",
    ]);
    expect(tokenAt(layerStyles, "dim.others")).toBeDefined();
    expect(tokenAt(layerStyles, "ripple")).toBeDefined();
  });

  it("blurs by a step of the blur scale", () => {
    expect(tokenAt(layerStyles, "blur.md")).toStrictEqual({ filter: "blur({blurs.md})" });
  });

  it("dims and blurs the siblings of a hovered child after a fast transition", () => {
    expect(tokenAt(layerStyles, "dim.others")).toStrictEqual({
      "&:has(> :hover) > :not(:hover)": { filter: "blur({blurs.xs})", opacity: "muted" },
      "& > *": {
        transition: "filter {durations.fast} {easings.out}, opacity {durations.fast} {easings.out}",
      },
    });
  });

  it("masks an edge or a centre with a gradient", () => {
    expect(tokenAt(layerStyles, "mask.bottom")).toStrictEqual({
      maskImage: "linear-gradient(to bottom, black 60%, transparent)",
    });
    expect(tokenAt(layerStyles, "mask.edges")).toStrictEqual({
      maskImage:
        "linear-gradient(to right, transparent, black {sizes.8}, black calc(100% - {sizes.8}), transparent)",
    });
    expect(tokenAt(layerStyles, "mask.radial")).toMatchObject({
      maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)",
    });
  });

  it("grows the ripple from the point a press names and centres it where none is named", () => {
    expect(tokenAt(layerStyles, "ripple")).toMatchObject({
      _active: {
        _after: {
          opacity: "0.12",
          transform: "translate(-50%, -50%) scale(var(--ripple-scale, 3))",
        },
      },
      _after: {
        aspectRatio: "1",
        background: "radial-gradient(closest-side, currentColor 75%, transparent 100%)",
        left: "var(--ripple-x, 50%)",
        opacity: "0",
        top: "var(--ripple-y, 50%)",
        transform: "translate(-50%, -50%) scale(0.3)",
        width: "100%",
      },
      overflow: "hidden",
      position: "relative",
    });
  });

  it("holds the ripple still for a reader who asked for less motion", () => {
    expect(tokenAt(layerStyles, "ripple")).toMatchObject({
      _motionReduce: { "--ripple-pace": "0" },
      "--ripple-pace": "1",
    });
  });

  it("draws the patterned backdrops from the lines and the fills", () => {
    expect(tokenAt(layerStyles, "backdrop.checker")).toStrictEqual({
      backgroundImage:
        "conic-gradient({colors.bg.emphasized} 25%, transparent 0 50%, {colors.bg.emphasized} 0 75%, transparent 0)",
      backgroundSize: "{sizes.8} {sizes.8}",
    });
    expect(tokenAt(layerStyles, "backdrop.vignette")).toStrictEqual({
      backgroundImage:
        "radial-gradient(ellipse at center, transparent 55%, {colors.blackAlpha.600})",
    });
    expect(
      String(Reflect.get(tokenAt(layerStyles, "backdrop.noise") ?? {}, "backgroundImage")),
    ).toContain("feTurbulence");
  });

  it("draws a solid fill in the palette with its hover inside it", () => {
    expect(tokenAt(layerStyles, "fill.solid")).toStrictEqual({
      _active: { background: "colorPalette.solid.hover" },
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
    expect(tokenAt(layerStyles, "fill.plain")).toStrictEqual({
      _active: { color: "colorPalette.solid" },
      color: "colorPalette.fg",
    });
  });

  it("names three field looks", () => {
    expect(Object.keys(tokenAt(layerStyles, "field") ?? {}).toSorted()).toStrictEqual([
      "flushed",
      "outline",
      "subtle",
    ]);
  });

  it("draws an outlined field on the panel surface and a subtle one on the muted fill", () => {
    expect(tokenAt(layerStyles, "field.outline")).toStrictEqual({
      background: "bg.panel",
      borderColor: "border",
    });
    expect(tokenAt(layerStyles, "field.subtle")).toStrictEqual({
      background: "bg.muted",
      borderColor: "transparent",
    });
  });

  it("leaves a flushed field its bottom edge alone", () => {
    expect(tokenAt(layerStyles, "field.flushed")).toStrictEqual({
      background: "transparent",
      borderBlockEndColor: "border",
      borderColor: "transparent",
      borderRadius: "0",
    });
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

  it("fills an outline in as it is hovered and further as it is pressed", () => {
    expect(tokenAt(layerStyles, "outline.solid")).toMatchObject({
      _active: { background: "colorPalette.muted" },
      _hover: { background: "colorPalette.subtle" },
    });
    expect(tokenAt(layerStyles, "outline.subtle")).toMatchObject({
      _active: { background: "colorPalette.muted" },
      _hover: { background: "colorPalette.subtle" },
    });
  });

  it("presses a fill to the palette's emphasized and a solid fill to the ink it hovers to", () => {
    expect(tokenAt(layerStyles, "fill.subtle")).toMatchObject({
      _active: { background: "colorPalette.emphasized" },
    });
    expect(tokenAt(layerStyles, "fill.solid")).toMatchObject({
      _active: { background: "colorPalette.solid.hover" },
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

  it("draws a glow as a shadow in the palette's solid at half strength", () => {
    expect(tokenAt(layerStyles, "glow.md")).toStrictEqual({
      boxShadow: "0 0 {sizes.8} var(--shadow-color)",
      boxShadowColor: "colorPalette.solid/50",
    });
    expect(tokenAt(layerStyles, "glow.sm")).toMatchObject({
      boxShadow: "0 0 {sizes.4} var(--shadow-color)",
    });
    expect(tokenAt(layerStyles, "glow.lg")).toMatchObject({
      boxShadow: "0 0 {sizes.12} var(--shadow-color)",
    });
  });

  it("draws a moving border as a conic sweep of the palette's solid round the panel surface", () => {
    expect(tokenAt(layerStyles, "border.moving")).toStrictEqual({
      background:
        "linear-gradient({colors.bg.panel}, {colors.bg.panel}) padding-box, conic-gradient(from var(--angle), transparent 60%, var(--colors-color-palette-solid) 85%, transparent) border-box",
      borderColor: "transparent",
      borderWidth: "sm",
    });
  });

  it("draws glass as the panel surface at seventy percent behind a blur", () => {
    expect(tokenAt(layerStyles, "glass")).toStrictEqual({
      _reducedTransparency: { backdropFilter: "none", background: "bg.panel" },
      backdropFilter: "blur({blurs.md})",
      background: "bg.panel/70",
      borderColor: "border.subtle",
      borderWidth: "sm",
    });
  });

  it("draws gradient text from the palette's solid to the accent's and clips it to the glyphs", () => {
    expect(tokenAt(layerStyles, "text.gradient")).toStrictEqual({
      backgroundClip: "text",
      backgroundImage:
        "linear-gradient(to right, var(--colors-color-palette-solid), var(--colors-accent-solid))",
      color: "transparent",
    });
    expect(tokenAt(layerStyles, "text.shine")).toMatchObject({
      _dark: {
        backgroundImage:
          "linear-gradient(to right, var(--colors-color-palette-fg), var(--colors-color-palette-solid), var(--colors-color-palette-fg))",
      },
      backgroundImage:
        "linear-gradient(to right, var(--colors-color-palette-fg), var(--colors-color-palette-emphasized), var(--colors-color-palette-fg))",
      backgroundSize: "200% auto",
    });
  });

  it("draws the backdrops from the lines and the gradients", () => {
    expect(tokenAt(layerStyles, "backdrop.dots")).toStrictEqual({
      backgroundImage:
        "radial-gradient({colors.border} {borderWidths.sm}, transparent {borderWidths.sm})",
      backgroundSize: "{sizes.4} {sizes.4}",
    });
    expect(tokenAt(layerStyles, "backdrop.aurora")).toStrictEqual({
      backgroundImage: "{gradients.aurora}",
      backgroundSize: "300% 300%",
    });
    expect(tokenAt(layerStyles, "backdrop.spotlight")).toMatchObject({
      "--spotlight-color": "var(--colors-color-palette-muted)",
      backgroundImage:
        "radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 0%), var(--spotlight-color) 0%, transparent 55%)",
    });
  });

  it("tiles a star field of nine dots in the ink the surface is written in", () => {
    expect(tokenAt(layerStyles, "backdrop.stars")).toStrictEqual({
      backgroundImage: [
        "radial-gradient({borderWidths.md} {borderWidths.md} at 8% 14%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.sm} {borderWidths.sm} at 23% 62%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.sm} {borderWidths.sm} at 37% 9%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.md} {borderWidths.md} at 46% 41%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.sm} {borderWidths.sm} at 58% 77%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.sm} {borderWidths.sm} at 67% 23%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.md} {borderWidths.md} at 79% 55%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.sm} {borderWidths.sm} at 88% 31%, currentcolor 99%, transparent)",
        "radial-gradient({borderWidths.sm} {borderWidths.sm} at 94% 86%, currentcolor 99%, transparent)",
      ].join(", "),
      backgroundSize: "{sizes.96} {sizes.48}",
    });
  });

  it("rules a diagonal line a whole pixel wide where an upright one holds at half", () => {
    expect(tokenAt(layerStyles, "backdrop.stripes")).toStrictEqual({
      backgroundImage:
        "repeating-linear-gradient(135deg, {colors.border} 0 {borderWidths.sm}, transparent {borderWidths.sm} {sizes.4})",
    });
    expect(tokenAt(layerStyles, "backdrop.grid")).toStrictEqual({
      backgroundImage:
        "linear-gradient(to right, {colors.border} {borderWidths.xs}, transparent {borderWidths.xs}), linear-gradient(to bottom, {colors.border} {borderWidths.xs}, transparent {borderWidths.xs})",
      backgroundSize: "{sizes.8} {sizes.8}",
    });
  });
});
