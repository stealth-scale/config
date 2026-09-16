/**
 * Defines the layer styles: the looks a recipe names with `layerStyle` instead of writing a fill,
 * an ink and a hover of its own.
 *
 * @remarks
 *   Every look reads the palette through `colorPalette`, so one look draws in every palette an
 *   application installs. A fill carries its hover, so a theme that changes how a solid control
 *   hovers changes it once for every solid thing. There is no ring here: the focus ring is the
 *   compiler's `focusVisibleRing` utility over the global focus-ring property, and the
 *   `interactive` helper sets its color to the palette's role.
 */

import { type LayerStyle, type LayerStyles } from "#pandacss.ts";

/**
 * Describes one look as the compiler reads it.
 */
type Look = Record<"value", LayerStyle>;

/**
 * Writes a fill: a background, the ink on it, and the background it hovers to.
 */
function fill(background: string, color: string, hovered: string): Look {
  return { value: { _hover: { background: hovered }, background, color } };
}

/**
 * Writes an indicator: a bar drawn along one edge in the palette's solid, for a selected tab or
 * an active row.
 *
 * @param edge - The placement of the bar, as the inset properties that pin it to its edge.
 */
function indicator(edge: LayerStyle): Look {
  return {
    value: {
      _before: {
        background: "colorPalette.solid",
        content: '""',
        position: "absolute",
        ...edge,
      },
      position: "relative",
    },
  };
}

/**
 * Lists the looks: the fills, the outlines, the indicators, and the disabled state.
 */
export const layerStyles: LayerStyles = {
  disabled: { value: { cursor: "disabled", opacity: "disabled" } },
  fill: {
    ghost: fill("transparent", "colorPalette.fg", "colorPalette.muted"),
    muted: fill("colorPalette.muted", "colorPalette.fg", "colorPalette.emphasized"),
    plain: { value: { color: "colorPalette.fg" } },
    solid: fill("colorPalette.solid", "colorPalette.contrast", "colorPalette.solid.hover"),
    subtle: fill("colorPalette.subtle", "colorPalette.fg", "colorPalette.muted"),
    surface: {
      value: {
        ...fill("colorPalette.subtle", "colorPalette.fg", "colorPalette.muted").value,
        borderColor: "colorPalette.border",
        borderWidth: "sm",
      },
    },
  },
  indicator: {
    bottom: indicator({ bottom: "0", height: "{borderWidths.md}", insetInline: "0" }),
    end: indicator({ insetBlock: "0", insetInlineEnd: "0", width: "{borderWidths.md}" }),
    start: indicator({ insetBlock: "0", insetInlineStart: "0", width: "{borderWidths.md}" }),
    top: indicator({ height: "{borderWidths.md}", insetInline: "0", top: "0" }),
  },
  outline: {
    solid: {
      value: {
        _hover: { background: "colorPalette.subtle" },
        borderColor: "colorPalette.solid",
        borderWidth: "sm",
        color: "colorPalette.fg",
      },
    },
    subtle: {
      value: {
        _hover: { borderColor: "colorPalette.border.hover" },
        borderColor: "colorPalette.border",
        borderWidth: "sm",
        color: "colorPalette.fg",
      },
    },
  },
};
