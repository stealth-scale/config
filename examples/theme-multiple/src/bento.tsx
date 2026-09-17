/**
 * Draws a bento: five tiles in a dense three-column grid, one of them two columns by two rows,
 * one two columns wide, each dressed in a backdrop of its own, and the others dimmed while one is
 * hovered.
 *
 * @remarks
 *   The grid and the spans are the `bento` and `bentoCell` patterns written out, because a page
 *   writes its styles as literals the compiler extracts, and a pattern is a function a recipe
 *   calls. A tile fills with `backgroundColor` rather than `background`, so the backdrop's image
 *   survives beside the fill. The tiles read the panel surface and the border, so every theme
 *   moves them.
 */

import { type ReactElement } from "react";

import { css } from "@stealthscale/theme";

/**
 * Lays the tiles out as a dense grid of three equal columns, and dims the others while one is
 * hovered.
 */
const box = css({
  display: "grid",
  gap: "gap.md",
  gridAutoFlow: "dense",
  gridAutoRows: "32",
  gridTemplateColumns: { base: "repeat(1, minmax(0, 1fr))", md: "repeat(3, minmax(0, 1fr))" },
  layerStyle: "dim.others",
});

/**
 * Draws one tile on the panel surface with a border and the medium corner.
 */
const tile = css({
  backgroundColor: "bg.panel",
  borderColor: "border",
  borderRadius: "l2",
  borderWidth: "sm",
  display: "flex",
  overflow: "hidden",
  padding: "inset.md",
});

/**
 * Spans the first tile over two columns and two rows on a desk, over an aurora.
 */
const hero = css({
  animationStyle: "aurora",
  gridColumn: { base: "span 1", md: "span 2" },
  gridRow: "span 2",
  layerStyle: "backdrop.aurora",
});

/**
 * Spans the wide tile over two columns on a desk, over stripes.
 */
const wide = css({
  gridColumn: { base: "span 1", md: "span 2" },
  layerStyle: "backdrop.stripes",
});

/**
 * Darkens a tile towards its edges.
 */
const vignette = css({ layerStyle: "backdrop.vignette" });

/**
 * Dresses a tile in grain.
 */
const grain = css({ layerStyle: "backdrop.noise" });

/**
 * Dresses a tile in a checkerboard.
 */
const checker = css({ layerStyle: "backdrop.checker" });

/**
 * Draws the bento.
 */
export function Bento(): ReactElement {
  return (
    <section aria-label="Bento" className={box}>
      <div className={`${tile} ${hero}`}>Aurora, two by two</div>
      <div className={`${tile} ${vignette}`}>Vignette</div>
      <div className={`${tile} ${grain}`}>Noise</div>
      <div className={`${tile} ${wide}`}>Stripes, two wide</div>
      <div className={`${tile} ${checker}`}>Checker</div>
    </section>
  );
}
