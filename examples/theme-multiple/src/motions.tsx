/**
 * Draws the motions that loop or read the scroll: a bar along the top of the viewport that fills
 * as the page is read, a floating chip, a spinning ring, three twinkling dots, a meteor across a
 * dark sky, stripes that drift with the scroll, and the list that rises in turn.
 *
 * @remarks
 *   Every motion is the foundation's, named by `animationStyle`, and every one holds still under
 *   `prefers-reduced-motion`. The `twinkle` motion reads `--stagger` off the element, so each dot
 *   carries its place as a class of its own. The pane round the stripes clips rather than hides,
 *   because a hidden overflow is a scroll container, and the drift would read that container's
 *   scroll instead of the page's.
 */

import { type ReactElement } from "react";

import { css, cx } from "@stealthscale/theme";

import { Rising } from "#rising.tsx";

/**
 * Lays the section out as a column in the accent palette.
 */
const section = css({
  colorPalette: "accent",
  display: "flex",
  flexDirection: "column",
  gap: "gap.md",
});

/**
 * Sets the heading in the medium heading style.
 */
const heading = css({ textStyle: "heading.md" });

/**
 * Draws a bar along the top of the viewport that fills from the left as the page scrolls.
 */
const progress = css({
  animationStyle: "progress",
  background: "colorPalette.solid",
  height: "1",
  insetInline: "0",
  position: "fixed",
  top: "0",
  zIndex: "banner",
});

/**
 * Lays a row of moving things out, wrapping where the row is too narrow.
 */
const row = css({ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "gap.md" });

/**
 * Draws a chip in the palette's subtle fill that bobs.
 */
const floating = css({
  animationStyle: "float",
  background: "colorPalette.subtle",
  borderRadius: "l1",
  color: "colorPalette.fg",
  paddingBlock: "inset.xs",
  paddingInline: "inset.sm",
});

/**
 * Draws a ring with one bright arc that turns.
 */
const ring = css({
  animationStyle: "spin",
  borderColor: "colorPalette.muted",
  borderRadius: "full",
  borderTopColor: "colorPalette.solid",
  borderWidth: "md",
  height: "6",
  width: "6",
});

/**
 * Draws a dot of the palette's solid that twinkles.
 */
const dot = css({
  animationStyle: "twinkle",
  background: "colorPalette.solid",
  borderRadius: "full",
  height: "3",
  width: "3",
});

/**
 * Lists the three dots, each by the class that states its place in the stagger.
 */
const DOTS: ReadonlyArray<readonly [name: string, place: string]> = [
  ["first", css({ "--stagger": "0" })],
  ["second", css({ "--stagger": "1" })],
  ["third", css({ "--stagger": "2" })],
];

/**
 * Draws a dark sky for the meteor to cross, in the inverted ink.
 */
const sky = css({
  background: "bg.inverted",
  borderRadius: "l2",
  color: "fg.inverted",
  minHeight: "32",
  overflow: "hidden",
  padding: "inset.md",
  position: "relative",
});

/**
 * Draws a streak of the inverted ink that crosses the sky and fades. The sky is the other mode's
 * page, so the palette's solid, drawn for this mode's surfaces, would sit in it unseen.
 */
const streak = css({
  animationStyle: "meteor",
  background: "linear-gradient(to right, {colors.fg.inverted}, transparent)",
  height: "0.5",
  position: "absolute",
  right: "0",
  top: "0",
  width: "32",
});

/**
 * Frames stripes taller than itself, clipped rather than hidden.
 */
const pane = css({ borderRadius: "l2", height: "32", overflow: "clip" });

/**
 * Draws stripes that drift with the scroll, taller than the pane and pulled up behind it, so the
 * drift shows and the pane stays covered.
 */
const drifting = css({
  animationStyle: "parallax",
  backgroundColor: "bg.subtle",
  layerStyle: "backdrop.stripes",
  marginTop: "-8",
  minHeight: "48",
  padding: "inset.md",
  paddingTop: "12",
});

/**
 * Draws the motions.
 */
export function Motions(): ReactElement {
  return (
    <section className={section}>
      <h2 className={heading}>Motions</h2>
      <div aria-hidden className={progress} />
      <p className={row}>
        <span className={floating}>Floating</span>
        <span aria-hidden className={ring} />
        {DOTS.map(([name, place]) => (
          <span aria-hidden className={cx(dot, place)} key={name} />
        ))}
      </p>
      <div className={sky}>
        A meteor across the sky
        <span aria-hidden className={streak} />
      </div>
      <div className={pane}>
        <div className={drifting}>Stripes that drift with the scroll</div>
      </div>
      <Rising />
    </section>
  );
}
