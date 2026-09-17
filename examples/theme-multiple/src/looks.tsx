/**
 * Draws the looks that hold still: a heading in gradient text, a card of glass over a drifting
 * aurora, three glows and three blurs, a paragraph that fades out at the bottom, a grid masked to
 * an ellipse, and a tile lit under the pointer.
 *
 * @remarks
 *   Every look is the foundation's, named by `layerStyle`, and every one reads the virtual
 *   palette, so the section is drawn in whichever palette the theme points at. An element wears
 *   one look, so a backdrop under a mask is the masked element's child, and a chip wears its glow
 *   or its blur beside its own fill through `cx`.
 */

import { type ReactElement } from "react";

import { css, cx } from "@stealthscale/theme";

import { Spotlight } from "#spotlight.tsx";

/**
 * Lays the section out as a column in the primary palette.
 */
const section = css({
  colorPalette: "primary",
  display: "flex",
  flexDirection: "column",
  gap: "gap.md",
});

/**
 * Sets the heading in text drawn from the palette's solid to the accent's.
 */
const gradient = css({ layerStyle: "text.gradient", textStyle: "heading.md" });

/**
 * Lays a row of chips out, wrapping where the row is too narrow.
 */
const row = css({ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "gap.md" });

/**
 * Draws a strip of drifting aurora with the large inset, for the glass to sit over.
 */
const aurora = css({
  animationStyle: "aurora",
  borderRadius: "l2",
  layerStyle: "backdrop.aurora",
  padding: "inset.lg",
});

/**
 * Draws a card of glass, through which the aurora shows blurred.
 */
const glass = css({ borderRadius: "l2", layerStyle: "glass", padding: "inset.md" });

/**
 * Draws a chip in the palette's subtle fill.
 */
const chip = css({
  background: "colorPalette.subtle",
  borderRadius: "l1",
  color: "colorPalette.fg",
  paddingBlock: "inset.xs",
  paddingInline: "inset.sm",
});

/**
 * Lists the glows and the blurs, each by the class that draws it.
 */
const WORN: ReadonlyArray<readonly [label: string, look: string]> = [
  ["Glow sm", css({ layerStyle: "glow.sm" })],
  ["Glow md", css({ layerStyle: "glow.md" })],
  ["Glow lg", css({ layerStyle: "glow.lg" })],
  ["Blur sm", css({ layerStyle: "blur.sm" })],
  ["Blur md", css({ layerStyle: "blur.md" })],
  ["Blur lg", css({ layerStyle: "blur.lg" })],
];

/**
 * Fades a column of text out towards its bottom.
 */
const fading = css({ layerStyle: "mask.bottom", maxWidth: "prose", textStyle: "body.md" });

/**
 * Masks whatever it holds to an ellipse.
 */
const ellipse = css({ borderRadius: "l2", layerStyle: "mask.radial" });

/**
 * Draws a grid over the subtle surface, tall enough to see.
 */
const grid = css({
  backgroundColor: "bg.subtle",
  layerStyle: "backdrop.grid",
  minHeight: "32",
  padding: "inset.md",
});

/**
 * Draws the looks.
 */
export function Looks(): ReactElement {
  return (
    <section className={section}>
      <h2 className={gradient}>Looks</h2>
      <div className={aurora}>
        <div className={glass}>Glass over an aurora</div>
      </div>
      <p className={row}>
        {WORN.map(([label, look]) => (
          <span className={cx(chip, look)} key={label}>
            {label}
          </span>
        ))}
      </p>
      <p className={fading}>
        A mask fades this paragraph out towards its bottom edge, so the text seems to run on under a
        fold. The mask is a gradient from black to transparent, and the ink and the surface of the
        paragraph are untouched, so it reads in every theme and in both color modes.
      </p>
      <div className={ellipse}>
        <div className={grid}>A grid masked to an ellipse</div>
      </div>
      <Spotlight />
    </section>
  );
}
