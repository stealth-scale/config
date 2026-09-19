/**
 * Draws the words naming the section.
 *
 * @remarks
 *   The element is `h2`, which is the level a section of a page sits at under the page's own
 *   heading. A page nesting sections deeper states `as="h3"` and so on: the recipe draws the size,
 *   and the level is the document's outline rather than a look.
 *   It carries the identifier the block names itself by, so writing this part is what makes the
 *   section a landmark. A caller states no identifier and no `aria-labelledby`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#section/context.ts";
import { useSection } from "#section/state.ts";

/**
 * Draws the words at the size the block states.
 */
const Named = withContext("h2", "title");

/**
 * Describes what the title takes, less the identifier the block gives it.
 */
export type TitleProps = Omit<ComponentProps<typeof Named>, "id">;

/**
 * Labels the section, and makes it a landmark by doing so.
 *
 * @param props - Everything a styled heading takes, less its identifier.
 * @returns The words, carrying the identifier the block points at.
 */
export function Title(props: TitleProps): ReactElement {
  const section = useSection();

  return <Named {...props} id={section.titleId} />;
}
