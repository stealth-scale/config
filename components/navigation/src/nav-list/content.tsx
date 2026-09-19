/**
 * Draws the list beneath a branch's row.
 *
 * @remarks
 *   The element is `ul`, and it carries the identifier the trigger points at. It is `hidden` while
 *   the branch is closed, which takes it out of the accessibility tree and out of the tab order
 *   together, so a destination inside a closed branch is not something a keyboard reaches.
 *   The rows inside it are the same `Item` and `Link` the list above uses. The content mutes the
 *   ink and they inherit it, so a nested row is quieter without a part of its own.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#nav-list/context.ts";
import { useBranch } from "#nav-list/state.ts";

/**
 * Draws the nested list at the size the list above states.
 */
const Shown = withContext("ul", "content");

/**
 * Describes what the content takes.
 */
export type ContentProps = Omit<ComponentProps<typeof Shown>, "hidden" | "id">;

/**
 * Appears and goes as the trigger above it is pressed.
 *
 * @param props - Everything a styled list takes, less what the branch states.
 * @returns The nested list, named by the branch and hidden while it is closed.
 */
export function Content(props: ContentProps): ReactElement {
  const branch = useBranch();

  return <Shown {...props} hidden={!branch.open} id={branch.id} />;
}
