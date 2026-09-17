/**
 * Draws a tile lit by a spotlight that follows the pointer.
 *
 * @remarks
 *   The look reads `--spotlight-x` and `--spotlight-y` off the element as a share of its box on
 *   each axis, and lights the top centre until they are written. The handler writes the two on
 *   every move, straight onto the element, because a light that follows the pointer moves far
 *   more often than a component should render.
 */

import { type PointerEvent, type ReactElement } from "react";

import { css } from "@stealthscale/theme";

/**
 * Draws the tile on the panel surface, with a border and the medium corner, under the spotlight.
 */
const tile = css({
  backgroundColor: "bg.panel",
  borderColor: "border",
  borderRadius: "l2",
  borderWidth: "sm",
  layerStyle: "backdrop.spotlight",
  minHeight: "32",
  padding: "inset.md",
});

/**
 * Writes where the pointer is over the tile, as a share of the tile on each axis.
 *
 * @remarks
 *   A tile that has no size yet is read as one pixel wide and high, so the share is never divided
 *   by zero.
 */
function light(event: PointerEvent<HTMLDivElement>): void {
  const { currentTarget } = event;
  const box = currentTarget.getBoundingClientRect();
  const x = ((event.clientX - box.left) / Math.max(box.width, 1)) * 100;
  const y = ((event.clientY - box.top) / Math.max(box.height, 1)) * 100;

  currentTarget.style.setProperty("--spotlight-x", `${x.toFixed(1)}%`);
  currentTarget.style.setProperty("--spotlight-y", `${y.toFixed(1)}%`);
}

/**
 * Draws the spotlit tile.
 */
export function Spotlight(): ReactElement {
  return (
    <div className={tile} onPointerMove={light}>
      A spotlight under the pointer
    </div>
  );
}
