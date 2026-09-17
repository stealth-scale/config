/**
 * Draws a panel dressed in the foundation's candy: a moving border, a heading that shines and
 * drifts with the scroll, a glowing button, a breathing one, a rippling one, and a marquee that
 * fades at its edges and rises into view.
 *
 * @remarks
 *   Every look and motion here is the foundation's, named by `layerStyle` and `animationStyle`,
 *   and every one reads the virtual palette, so the panel is drawn in whichever palette the theme
 *   points at. The marquee runs its words twice, so the loop has no seam where it starts again.
 */

import { type PointerEvent, type ReactElement } from "react";

import { Button } from "@stealthscale/example-lib-actions";
import { css } from "@stealthscale/theme";

/**
 * Draws the panel: a moving border swept round the panel surface, in the primary palette.
 */
const panel = css({
  animationStyle: "sweep",
  borderRadius: "l2",
  colorPalette: "primary",
  display: "flex",
  flexDirection: "column",
  gap: "gap.md",
  layerStyle: "border.moving",
  padding: "inset.md",
});

/**
 * Sets the heading in gradient text that shines across at the shimmer's pace.
 */
const shine = css({ animationStyle: "shimmer", layerStyle: "text.shine", textStyle: "heading.md" });

/**
 * Lays a row of controls out, wrapping where the row is too narrow.
 */
const row = css({ alignItems: "center", display: "flex", flexWrap: "wrap", gap: "gap.sm" });

/**
 * Draws a glow round whatever it is put on.
 */
const glow = css({ layerStyle: "glow.md" });

/**
 * Draws a glow that breathes.
 */
const breathing = css({ animationStyle: "pulse-glow", boxShadowColor: "colorPalette.solid/50" });

/**
 * Ripples from the point of the press.
 */
const ripple = css({ layerStyle: "ripple" });

/**
 * Writes where the pointer went down, as a share of the control's box, for the ripple to grow
 * from. Without it the ripple grows from the centre, which is what a press by the keyboard gets.
 */
function pressed(event: PointerEvent<HTMLElement>): void {
  const box = event.currentTarget.getBoundingClientRect();
  const { style } = event.currentTarget;

  style.setProperty("--ripple-x", `${String(((event.clientX - box.left) / box.width) * 100)}%`);
  style.setProperty("--ripple-y", `${String(((event.clientY - box.top) / box.height) * 100)}%`);
}

/**
 * Hides whatever runs past the edge of the marquee, fades both edges, and rises into view.
 */
const mask = css({ animationStyle: "reveal", layerStyle: "mask.edges", overflow: "hidden" });

/**
 * Runs a row of items across the marquee and round again.
 */
const track = css({
  animationStyle: "marquee",
  display: "flex",
  gap: "gap.md",
  width: "max-content",
});

/**
 * Lists the words the marquee runs.
 */
const WORDS = ["glow", "gradient", "moving border", "marquee", "shine", "glass", "aurora"];

/**
 * Draws the candy panel.
 */
export function Candy(): ReactElement {
  return (
    <section className={panel}>
      <h2 className={shine}>Eye candy</h2>
      <p className={row}>
        <Button className={glow}>Glowing</Button>
        <Button className={breathing} status="success">
          Breathing
        </Button>
        <Button className={ripple} onPointerDown={pressed} variant="subtle">
          Rippling
        </Button>
      </p>
      <div className={mask}>
        <div className={track}>
          {[...WORDS, ...WORDS].map((word, index) => (
            <span key={`${word}-${String(index)}`}>{word}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
