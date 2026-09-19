/**
 * Draws the column a page's bands sit in, and measures its own width.
 *
 * @remarks
 *   The element is `div` and carries no landmark. The shell around it owns `main`, and a page that
 *   claimed one would give a reader two to choose between on the same screen.
 *   The column measures itself rather than the window and states `folded` when it is too narrow for
 *   a header laid out in one row. A page beside an open sidebar therefore folds on its own room,
 *   and a consumer writes no breakpoint.
 *   It writes `data-narrow` beside the variant, because a row of actions inside the page folds on
 *   that attribute and a variant class reaches only the parts this recipe draws.
 */

import { type ComponentProps, type ReactElement, useMemo, useRef } from "react";

import { useNarrow, widthOf } from "@stealthscale/provider-viewport";

import { withProvider } from "#page/context.ts";
import { PageProvider, type PageSize } from "#page/state.ts";

/**
 * The breakpoint whose width the header lays itself out in more than one row below.
 *
 * @remarks
 *   Read as a width and compared to the column's own, not asked as a media query. A page beside an
 *   open sidebar is narrow while the window is wide, and that is the case this has to answer.
 */
const FOLDS_BELOW = "md";

/**
 * Draws the column and sets the variants every band below it reads.
 */
const Columned = withProvider("div", "root");

/**
 * Describes what the column takes, less what it measures for itself.
 */
export interface RootProps extends Omit<ComponentProps<typeof Columned>, "folded" | "size"> {
  /**
   * How large the page draws what names it, which a section inside it reads too.
   */
  readonly size?: PageSize | undefined;
}

/**
 * Lays a page out: a banner, a header, a navigation, a body and a footer.
 *
 * @param props - The recipe's variants and everything a styled div takes.
 * @returns The column, carrying whether it has folded.
 */
export function Root({ size = "md", ...rest }: RootProps): ReactElement {
  const measured = useRef<HTMLDivElement>(null);
  const folded = useNarrow(measured, widthOf(FOLDS_BELOW), FOLDS_BELOW);
  const state = useMemo(() => ({ narrow: folded, size }), [folded, size]);

  return (
    <PageProvider value={state}>
      <Columned
        {...rest}
        {...(folded ? { "data-narrow": "", folded: true } : {})}
        ref={measured}
        size={size}
      />
    </PageProvider>
  );
}
