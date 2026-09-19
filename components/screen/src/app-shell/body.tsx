/**
 * Lays the panels and the page out across, between the bars.
 *
 * @remarks
 *   The children sit in the order they are written, so a caller decides which panel leads. A panel
 *   that has dropped under the page wraps onto its own row and the page takes the row above it. The
 *   backdrop is drawn once, behind whatever panel is over the page, and pressing it puts every such
 *   panel away. It is always in the document and fades rather than being mounted and unmounted, so
 *   the fade runs both ways, and it takes no press and no reading while nothing is over the page.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#app-shell/context.ts";
import { useOverlaid } from "#app-shell/state.ts";

/**
 * Draws the row the panels and the page sit in.
 */
const Across = withContext("div", "body");

/**
 * Draws what stands between the page and a panel over it.
 */
const Backdrop = withContext("div", "backdrop");

/**
 * Describes what the body takes.
 */
export type BodyProps = ComponentProps<typeof Across>;

/**
 * Draws the row between the bars, and the backdrop behind a panel laid over the page.
 *
 * @param props - The panels and the page, and everything a styled div takes.
 * @returns The row, with its backdrop.
 */
export function Body({ children, ...rest }: BodyProps): ReactElement {
  const sheets = useOverlaid();

  return (
    <Across {...rest}>
      {children}
      <Backdrop
        aria-hidden
        data-state={sheets.length > 0 ? "open" : "closed"}
        onClick={() => {
          for (const sheet of sheets) sheet.setOpen(false);
        }}
      />
    </Across>
  );
}
