/**
 * Draws the block a section of a page sits in, names itself after its title, and measures its own
 * width.
 *
 * @remarks
 *   The element is `section`, and it points `aria-labelledby` at the identifier its title carries.
 *   A section with a title is therefore a landmark a reader can jump to, and a caller writes no
 *   identifier and no reference.
 *   Draw the title. A section without one points at an element that is not there, which resolves to
 *   no name, and a region nobody can name is one a reader reaches and cannot place. State
 *   `aria-label` on the root instead where the words belong somewhere else on the screen.
 *   The size comes from the page the block sits in, so a page set to `lg` is a page whose sections
 *   are `lg` and a caller states it once. A section states its own to override that, and one
 *   outside a page reads the middle size.
 *   The block measures itself rather than the window, so a section beside an open sidebar folds on
 *   its own room and a consumer writes no breakpoint.
 */

import { type ComponentProps, type ReactElement, useId, useMemo, useRef } from "react";

import { useNarrow, widthOf } from "@stealthscale/provider-viewport";

import { useOptionalPage } from "#page/state.ts";
import { withProvider } from "#section/context.ts";
import { SectionProvider } from "#section/state.ts";

/**
 * The breakpoint whose width the header folds back over the body below.
 *
 * @remarks
 *   Read as a width and compared to the block's own, not asked as a media query. A section beside
 *   an open sidebar is narrow while the window is wide, and that is the case this has to answer.
 */
const FOLDS_BELOW = "sm";

/**
 * Draws the block and sets the variants every part below it reads.
 */
const Block = withProvider("section", "root");

/**
 * Describes what the block takes.
 */
export type RootProps = Omit<ComponentProps<typeof Block>, "aria-labelledby">;

/**
 * Groups a title, what it explains and what acts on it.
 *
 * @param props - The recipe's variants and everything a styled section takes.
 * @returns The block, named by its title and carrying whether it is narrow.
 */
export function Root({ size, ...rest }: RootProps): ReactElement {
  const measured = useRef<HTMLElement>(null);
  const narrow = useNarrow(measured, widthOf(FOLDS_BELOW), FOLDS_BELOW);
  const page = useOptionalPage();
  const titleId = useId();
  const state = useMemo(() => ({ narrow, titleId }), [narrow, titleId]);

  return (
    <SectionProvider value={state}>
      <Block
        aria-labelledby={titleId}
        size={size ?? page?.size ?? "md"}
        {...rest}
        data-narrow={narrow ? "" : undefined}
        ref={measured}
      />
    </SectionProvider>
  );
}
