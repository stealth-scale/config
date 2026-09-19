/**
 * Draws one panel down a side of the page.
 *
 * @remarks
 *   In the body the panel is always drawn. Its track moves between the width it opens to and the
 *   width it closes to, and what it holds keeps the open width so the contents do not reflow while
 *   the track moves. Closed to nothing, the track is inert as well, so nothing inside it takes a
 *   Tab. Where the shell is too narrow to hold the panel beside the page, `folds` decides what
 *   happens: `over` lays it over the page behind a backdrop, and `under` drops it under the page as
 *   a block that is always shown. A panel over the page starts closed whatever it was in the body,
 *   unless an application states `open`, which decides at every width. The panel draws what it
 *   holds rather than leaving that to the caller, because the contents have to keep the open width
 *   for the track to clip rather than reflow them, and a caller who composed that by hand would be
 *   composing the one part that makes the movement work.
 */

import { type ComponentProps, type ReactElement, useRef } from "react";

import { withContext } from "#app-shell/context.ts";
import { PanelProvider, type Side } from "#app-shell/state.ts";
import { type PanelOptions, usePanel } from "#app-shell/use-panel.ts";

/**
 * Draws the element each side is, bound to its slot.
 *
 * @remarks
 *   The end side is `aside`, which anything beside the page is. The start side claims nothing: a
 *   navigation inside it names its own landmark, and a rail of tools is no landmark at all.
 */
const TRACKS = { end: withContext("aside", "aside"), start: withContext("div", "navbar") };

/**
 * Draws what the panel holds, at the width it opens to.
 */
const Held = withContext("div", "content");

/**
 * Describes what a panel takes beside the side it is drawn on.
 */
export interface PanelProps
  extends Omit<ComponentProps<typeof Held>, "id" | keyof PanelOptions>, PanelOptions {
  /**
   * Which side of the page the panel sits on.
   */
  readonly side: Side;
}

/**
 * Draws one panel, in the body, over the page or under it.
 *
 * @param props - How the panel folds and closes, and what it holds.
 * @returns The track, holding the contents.
 */
export function Panel(props: PanelProps): ReactElement {
  const {
    children,
    collapse = "hide",
    defaultOpen,
    folds = "over",
    foldsBelow,
    name,
    onOpenChange,
    open,
    shortcut,
    side,
    ...rest
  } = props;
  const inner = useRef<HTMLDivElement>(null);
  const { inert, panel } = usePanel(
    side,
    { collapse, defaultOpen, folds, foldsBelow, name, onOpenChange, open, shortcut },
    inner,
  );
  const Track = TRACKS[side];

  return (
    <PanelProvider value={panel}>
      <Track
        {...rest}
        data-collapse={collapse}
        data-overlaid={panel.overlaid ? "" : undefined}
        data-stacked={panel.stacked ? "" : undefined}
        data-state={panel.open ? "open" : "closed"}
        id={panel.id}
        inert={inert}
      >
        <Held ref={inner} tabIndex={-1}>
          {children}
        </Held>
      </Track>
    </PanelProvider>
  );
}
