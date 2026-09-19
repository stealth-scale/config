/**
 * Draws the column an application is laid out in.
 *
 * @remarks
 *   The element is `div` and carries no landmark. The bars and the page inside it carry their own,
 *   and a landmark round the whole screen names nothing a reader can act on.
 *   The root states nothing about the panels. Each panel says how wide it is and how it closes
 *   where it is drawn, and writes that to the store the root opens, so a trigger anywhere in the
 *   shell reaches a panel it was never handed.
 *   The root is also what every panel measures itself against. It is as wide as the shell whatever
 *   the panels do, so a panel opening never changes the measurement that let it open.
 */

import { type ComponentProps, type ReactElement, useMemo, useRef } from "react";

import { useConst, useStickyOffsets } from "@stealthscale/hooks";

import { withProvider } from "#app-shell/context.ts";
import { panelStore } from "#app-shell/panels.ts";
import { STICKY_OFFSET, STICKY_TOP } from "#app-shell/recipe.ts";
import { ShellProvider } from "#app-shell/state.ts";

/**
 * Which bars are pinned, in the order they stack, and what each is told.
 *
 * @remarks
 *   A second pinned bar sticks under the first, so each needs the height of the bars above it,
 *   which a sticky offset in CSS alone cannot express. The root is told the height of all of them,
 *   which the panels stick under.
 */
const PINNED = {
  bands: ":scope > .app-shell__header[data-sticky]",
  offset: STICKY_OFFSET,
  total: STICKY_TOP,
};

/**
 * Draws the column and sets the variants every part below it reads.
 */
const Columned = withProvider("div", "root");

/**
 * Describes what the shell takes.
 */
export type RootProps = ComponentProps<typeof Columned>;

/**
 * Lays an application out: bars across the top and the bottom, and a body between them holding a
 * panel down either side of the page.
 *
 * @param props - The recipe's variants and everything a styled div takes.
 * @returns The column, with the shell in scope.
 */
export function Root({ scroll = "page", ...rest }: RootProps): ReactElement {
  const measured = useRef<HTMLDivElement>(null);
  const panels = useConst(panelStore);
  const state = useMemo(() => ({ panels, root: measured }), [panels]);

  useStickyOffsets(measured, scroll === "window", PINNED);

  return (
    <ShellProvider value={state}>
      <Columned {...rest} ref={measured} scroll={scroll} />
    </ShellProvider>
  );
}
