/**
 * Defines the looks a recipe reads by name: the fills and outlines a control is drawn in, the
 * indicators along an edge, the disabled look, and the glows, glass, gradient texts and backdrops
 * a page is dressed with.
 *
 * @remarks
 *   Every look reads the virtual palette, so one look draws in every palette an application
 *   installs, and a fill carries its hover, so a theme that changes what solid means or how it
 *   hovers changes it once for every solid thing. There is no ring here: the focus ring is the
 *   compiler's `focusVisibleRing` utility over the global focus-ring property, and the
 *   `interactive` helper sets its color from the palette. A look holds still. The moving border
 *   and the shine are drawn here and moved by the `sweep` and `shimmer` animation styles, which a
 *   recipe names beside them. The ripple is the one look that moves on its own, through a
 *   transition a press interrupts and a release lets run. A backdrop is a background image, so a
 *   recipe that pairs one with a fill writes `backgroundColor`, because the `background` shorthand
 *   resets the image. A textured backdrop is drawn in the line color and the emphasized surface,
 *   which the contrast checks hold apart from every surface in both modes. The subtle line and
 *   the subtle surface meet on a light page, and a texture drawn in them was there in dark mode
 *   alone.
 */

import { type LayerStyle, type LayerStyles } from "#pandacss.ts";

/**
 * Describes one look as the compiler reads it.
 */
type Look = Record<"value", LayerStyle>;

/**
 * Fixes the palette's solid as a custom property, for a gradient that reads the palette.
 */
const SOLID = "var(--colors-color-palette-solid)";

/**
 * Fixes the palette's ink as a custom property, for a gradient that reads the palette.
 */
const INK = "var(--colors-color-palette-fg)";

/**
 * Fixes the palette's emphasized fill as a custom property, for a band that reads on the ink in
 * light mode, where the solid is as dark as the ink.
 */
const EMPHASIZED = "var(--colors-color-palette-emphasized)";

/**
 * Fixes a tile of fractal noise as an inline image, for a backdrop with grain.
 *
 * @remarks
 *   A data URI rather than a file, so a theme package ships no asset and a stylesheet carries the
 *   grain itself. The rect is drawn at forty percent so the grain is laid over a surface rather
 *   than in place of it.
 */
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")";

/**
 * Writes a blur of one strength.
 */
function blurred(strength: string): Look {
  return { value: { filter: `blur(${strength})` } };
}

/**
 * Writes a fill: a background, the ink on it, and the background it hovers to.
 */
function fill(background: string, color: string, hovered: string): Look {
  return { value: { _hover: { background: hovered }, background, color } };
}

/**
 * Writes an indicator: a bar in the palette's solid along one edge of a positioned box.
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
 * Writes a glow: a shadow of one blur in the palette's solid at half strength.
 */
function glow(blur: string): Look {
  return {
    value: {
      boxShadow: `0 0 ${blur} var(--shadow-color)`,
      boxShadowColor: "colorPalette.solid/50",
    },
  };
}

/**
 * Writes text drawn in a gradient rather than an ink, clipped to the glyphs.
 */
function gradientText(stops: string): Look {
  return {
    value: {
      backgroundClip: "text",
      backgroundImage: `linear-gradient(to right, ${stops})`,
      color: "transparent",
    },
  };
}

/**
 * Lists the looks.
 */
export const layerStyles: LayerStyles = {
  backdrop: {
    aurora: { value: { backgroundImage: "{gradients.aurora}", backgroundSize: "300% 300%" } },
    checker: {
      value: {
        backgroundImage:
          "conic-gradient({colors.bg.emphasized} 25%, transparent 0 50%, {colors.bg.emphasized} 0 75%, transparent 0)",
        backgroundSize: "{sizes.8} {sizes.8}",
      },
    },
    dots: {
      value: {
        backgroundImage:
          "radial-gradient({colors.border} {borderWidths.sm}, transparent {borderWidths.sm})",
        backgroundSize: "{sizes.4} {sizes.4}",
      },
    },
    grid: {
      value: {
        backgroundImage:
          "linear-gradient(to right, {colors.border} {borderWidths.xs}, transparent {borderWidths.xs}), linear-gradient(to bottom, {colors.border} {borderWidths.xs}, transparent {borderWidths.xs})",
        backgroundSize: "{sizes.8} {sizes.8}",
      },
    },
    noise: { value: { backgroundImage: NOISE } },
    spotlight: {
      value: {
        "--spotlight-color": "var(--colors-color-palette-muted)",
        backgroundImage:
          "radial-gradient(circle at var(--spotlight-x, 50%) var(--spotlight-y, 0%), var(--spotlight-color) 0%, transparent 55%)",
      },
    },
    stripes: {
      value: {
        backgroundImage:
          "repeating-linear-gradient(135deg, {colors.border} 0 {borderWidths.xs}, transparent {borderWidths.xs} {sizes.4})",
      },
    },
    vignette: {
      value: {
        backgroundImage:
          "radial-gradient(ellipse at center, transparent 55%, {colors.blackAlpha.600})",
      },
    },
  },
  blur: {
    lg: blurred("{blurs.lg}"),
    md: blurred("{blurs.md}"),
    sm: blurred("{blurs.sm}"),
  },
  border: {
    moving: {
      value: {
        background: `linear-gradient({colors.bg.panel}, {colors.bg.panel}) padding-box, conic-gradient(from var(--angle), transparent 60%, ${SOLID} 85%, transparent) border-box`,
        borderColor: "transparent",
        borderWidth: "sm",
      },
    },
  },
  dim: {
    others: {
      value: {
        "&:has(> :hover) > :not(:hover)": { filter: "blur({blurs.xs})", opacity: "muted" },
        "& > *": {
          transition:
            "filter {durations.fast} {easings.out}, opacity {durations.fast} {easings.out}",
        },
      },
    },
  },
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
  glass: {
    value: {
      _reducedTransparency: { backdropFilter: "none", background: "bg.panel" },
      backdropFilter: "blur({blurs.md})",
      background: "bg.panel/70",
      borderColor: "border.subtle",
      borderWidth: "sm",
    },
  },
  glow: {
    lg: glow("{sizes.12}"),
    md: glow("{sizes.8}"),
    sm: glow("{sizes.4}"),
  },
  indicator: {
    bottom: indicator({ bottom: "0", height: "{borderWidths.md}", insetInline: "0" }),
    end: indicator({ insetBlock: "0", insetInlineEnd: "0", width: "{borderWidths.md}" }),
    start: indicator({ insetBlock: "0", insetInlineStart: "0", width: "{borderWidths.md}" }),
    top: indicator({ height: "{borderWidths.md}", insetInline: "0", top: "0" }),
  },
  mask: {
    bottom: { value: { maskImage: "linear-gradient(to bottom, black 60%, transparent)" } },
    edges: {
      value: {
        maskImage:
          "linear-gradient(to right, transparent, black {sizes.8}, black calc(100% - {sizes.8}), transparent)",
      },
    },
    radial: {
      value: { maskImage: "radial-gradient(ellipse at center, black 40%, transparent 75%)" },
    },
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
  ripple: {
    value: {
      _active: { _after: { opacity: "0.4", transform: "scale(0)", transition: "none" } },
      _after: {
        background: "currentColor",
        borderRadius: "inherit",
        content: '""',
        inset: "0",
        opacity: "0",
        pointerEvents: "none",
        position: "absolute",
        transform: "scale(4)",
        transition:
          "transform {durations.slower} {easings.out}, opacity {durations.slower} {easings.out}",
      },
      overflow: "hidden",
      position: "relative",
    },
  },
  text: {
    gradient: gradientText(`${SOLID}, var(--colors-accent-solid)`),
    shine: {
      value: {
        ...gradientText(`${INK}, ${EMPHASIZED}, ${INK}`).value,
        _dark: { backgroundImage: `linear-gradient(to right, ${INK}, ${SOLID}, ${INK})` },
        backgroundSize: "200% auto",
      },
    },
  },
};
