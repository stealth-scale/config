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
 *   recipe names beside them. The ripple is the one look that moves on its own: it grows from the
 *   point a component writes as `--ripple-x` and `--ripple-y`, the center where it writes none,
 *   over a press, and it fades at full size over the release rather than shrinking back. Its rim
 *   is soft, because a circle with a hard edge reads as a disc laid on the control rather than as
 *   a ripple through it, and it carries the state-layer opacity a pressed surface is tinted by.
 *   `--ripple-scale` is how far it grows, as a multiple of its own width: it is a circle as wide as
 *   the control, which reaches the far corner of a square one at 2.83, so three covers a control of
 *   any shape that is not taller than it is wide. CSS reads no element's own aspect ratio, so a
 *   tall surface states its own. `--ripple-pace` scales every duration at once, and a reader who
 *   asked for less motion sets it to zero, which holds the ripple still without a rule that has to
 *   outrank the press. A backdrop is a background image, so a
 *   recipe that pairs one with a fill writes `backgroundColor`, because the `background` shorthand
 *   resets the image. A textured backdrop is drawn in the line color and the emphasized surface,
 *   which the contrast checks hold apart from every surface in both modes. The subtle line and
 *   the subtle surface meet on a light page, and a texture drawn in them was there in dark mode
 *   alone. The star field is the one backdrop drawn in `currentcolor`, because it is laid over a
 *   surface a recipe inverts, and the ink of that surface is the only color that follows it. A
 *   line a backdrop draws on the diagonal is a whole pixel wide, because half a pixel across a
 *   diagonal samples to a dashed line; an upright one holds at half.
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
 * Writes a fill: a background, the ink on it, the background it hovers to, and the background it
 * is pressed to.
 *
 * @remarks
 *   A solid fill is pressed to the background it hovers to, because the palette states no role
 *   below its solid, and the squeeze an interactive control draws carries the press there.
 */
function fill(background: string, color: string, hovered: string, pressed = hovered): Look {
  return {
    value: { _active: { background: pressed }, _hover: { background: hovered }, background, color },
  };
}

/**
 * Writes an outline: a line round the box, the ink inside it, and the background it fills with
 * as a pointer hovers and presses.
 *
 * @remarks
 *   An outline reads as pressed by filling in rather than by changing its line, because a line
 *   one step darker is the same change a hover makes and a press that looks like a hover reads
 *   as nothing happening. The fill is clipped to the padding box, so a rounded corner is drawn
 *   as one antialiased curve: a fill that runs under the line lays a second curve over the first,
 *   and the two read as a corner heavier than the edges it joins.
 */
function outlined(line: string, hovered: string): Look {
  return {
    value: {
      _active: { background: "colorPalette.muted", borderColor: hovered },
      _hover: { background: "colorPalette.subtle", borderColor: hovered },
      backgroundClip: "padding-box",
      borderColor: line,
      borderWidth: "sm",
      color: "colorPalette.fg",
    },
  };
}

/**
 * Writes a flat look: a background and the ink on it, and nothing a pointer changes.
 *
 * @remarks
 *   A badge, a tag and a chip read as part of what they label rather than as something to press,
 *   so they repaint under no pointer. A fill would repaint: a badge inside a row that hovers is
 *   under the pointer whenever the row is, and a badge that lights up on its own reads as a
 *   control a reader can press and then cannot.
 */
function flat(background: string, color = "colorPalette.fg"): Look {
  return { value: { background, color } };
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
 * Places the stars of a field, each as a share of the tile the field repeats in, against how wide
 * it is drawn.
 *
 * @remarks
 *   The places are irregular, because a star field on a grid reads as a grid. Two widths give the
 *   field depth without a second image. The tile the field repeats in is twice as wide as it is
 *   tall, because a sky is wider than it is tall: a square tile repeats often enough across a wide
 *   one to read as a rhythm, and the lower half of it falls outside a short one, taking its stars
 *   with it.
 */
const STARS: ReadonlyArray<readonly [x: string, y: string, width: string]> = [
  ["8%", "14%", "{borderWidths.md}"],
  ["23%", "62%", "{borderWidths.sm}"],
  ["37%", "9%", "{borderWidths.sm}"],
  ["46%", "41%", "{borderWidths.md}"],
  ["58%", "77%", "{borderWidths.sm}"],
  ["67%", "23%", "{borderWidths.sm}"],
  ["79%", "55%", "{borderWidths.md}"],
  ["88%", "31%", "{borderWidths.sm}"],
  ["94%", "86%", "{borderWidths.sm}"],
];

/**
 * Draws every star as a dot of the ink the surface is written in, held to its own edge, because a
 * dot a pixel across that fades from its center is a smudge.
 */
const STARFIELD = STARS.map(
  ([x, y, width]) =>
    `radial-gradient(${width} ${width} at ${x} ${y}, currentcolor 99%, transparent)`,
).join(", ");

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
    stars: {
      value: { backgroundImage: STARFIELD, backgroundSize: "{sizes.96} {sizes.48}" },
    },
    stripes: {
      value: {
        backgroundImage:
          "repeating-linear-gradient(135deg, {colors.border} 0 {borderWidths.sm}, transparent {borderWidths.sm} {sizes.4})",
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
    ghost: fill("transparent", "colorPalette.fg", "colorPalette.muted", "colorPalette.emphasized"),
    muted: fill("colorPalette.muted", "colorPalette.fg", "colorPalette.emphasized"),
    plain: {
      value: { _active: { color: "colorPalette.solid" }, color: "colorPalette.fg" },
    },
    solid: fill("colorPalette.solid", "colorPalette.contrast", "colorPalette.solid.hover"),
    subtle: fill(
      "colorPalette.subtle",
      "colorPalette.fg",
      "colorPalette.muted",
      "colorPalette.emphasized",
    ),
    surface: {
      value: {
        ...fill(
          "colorPalette.subtle",
          "colorPalette.fg",
          "colorPalette.muted",
          "colorPalette.emphasized",
        ).value,
        backgroundClip: "padding-box",
        borderColor: "colorPalette.border",
        borderWidth: "sm",
      },
    },
  },
  flat: {
    outline: {
      value: {
        backgroundClip: "padding-box",
        borderColor: "colorPalette.border",
        borderWidth: "sm",
        color: "colorPalette.fg",
      },
    },
    plain: { value: { color: "colorPalette.fg" } },
    solid: flat("colorPalette.solid", "colorPalette.contrast"),
    subtle: flat("colorPalette.subtle"),
    surface: {
      value: {
        ...flat("colorPalette.subtle").value,
        backgroundClip: "padding-box",
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
    solid: outlined("colorPalette.solid", "colorPalette.solid"),
    subtle: outlined("colorPalette.border", "colorPalette.border.hover"),
  },
  ripple: {
    value: {
      _active: {
        _after: {
          opacity: "0.12",
          transform: "translate(-50%, -50%) scale(var(--ripple-scale, 3))",
          transition:
            "opacity calc(var(--ripple-pace) * {durations.faster}) {easings.linear}, transform calc(var(--ripple-pace) * {durations.slowest}) {easings.in-out}",
        },
      },
      _after: {
        aspectRatio: "1",
        background: "radial-gradient(closest-side, currentColor 75%, transparent 100%)",
        content: '""',
        left: "var(--ripple-x, 50%)",
        opacity: "0",
        pointerEvents: "none",
        position: "absolute",
        top: "var(--ripple-y, 50%)",
        transform: "translate(-50%, -50%) scale(0.3)",
        transition:
          "opacity calc(var(--ripple-pace) * {durations.slower}) {easings.linear}, transform {durations.none} {easings.linear} calc(var(--ripple-pace) * {durations.slower})",
        width: "100%",
      },
      _motionReduce: { "--ripple-pace": "0" },
      "--ripple-pace": "1",
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
