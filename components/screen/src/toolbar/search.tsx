/**
 * Draws the search, which covers the row while it is open on one too narrow to hold both.
 *
 * @remarks
 *   A search field and a row of controls do not fit on a phone, and a field squeezed to nothing is
 *   a field nobody types in. Opened, the field is laid over the row and fills it; closed, it sits
 *   in the band it was written in.
 *   Whether it is open is the caller's, because the control that opens it is the caller's too and
 *   the two would otherwise each hold half the answer.
 *   Opening it puts the reader in the field, and closing it puts them back on the control they
 *   pressed. The control is under the field while the field is open, so a reader who was left on it
 *   would be standing on something out of sight, which is what WCAG calls a focus order that does
 *   not follow meaning.
 */

import { type ComponentProps, type ReactElement, useRef } from "react";

import { useFocused } from "#focus/index.ts";
import { withContext } from "#toolbar/context.ts";

/**
 * Selects what the reader is put in when the search opens, which is whatever takes typing.
 */
const FIELD = "input, textarea, [contenteditable=true]";

/**
 * Draws the search at the room the row states.
 */
const Sought = withContext("div", "search");

/**
 * Describes what the search takes.
 */
export interface SearchProps extends ComponentProps<typeof Sought> {
  /**
   * Whether the field is laid over the row rather than sitting in its band.
   */
  readonly opened?: boolean | undefined;
}

/**
 * Covers the row while it is open, and sits in its band while it is not.
 *
 * @param props - Whether it is open, and everything a styled div takes.
 * @returns The search, carrying whether it covers the row.
 */
export function Search({ opened, ...rest }: SearchProps): ReactElement {
  const sought = useRef<HTMLDivElement>(null);

  useFocused(sought, opened === true, FIELD);

  return <Sought {...rest} data-opened={opened === true ? "" : undefined} ref={sought} />;
}
