/**
 * Draws the column the bands sit in, and says whether it is collapsed to a rail.
 *
 * @remarks
 *   The element is `div` and carries no landmark. A sidebar usually holds one, drawn by the
 *   navigation inside it, and a landmark round a landmark gives a reader two to choose between for
 *   one set of destinations.
 *   `iconic` is a prop rather than something measured. The shell decides how wide the sidebar is,
 *   so the shell says when it has collapsed, and the sidebar writes the attribute its parts and the
 *   navigation list inside it both read. A sidebar that measured itself would disagree with the
 *   shell for one frame every time it moved.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#sidebar/context.ts";

/**
 * Draws the column and sets the variants every part below it reads.
 */
const Columned = withProvider("div", "root");

/**
 * Describes what the column takes.
 */
export interface RootProps extends ComponentProps<typeof Columned> {
  /**
   * Whether the sidebar is collapsed to a rail of marks.
   */
  readonly iconic?: boolean | undefined;
}

/**
 * Gathers what a person moves around an application by.
 *
 * @param props - Whether it is collapsed, the recipe's variants and everything a styled div takes.
 * @returns The column, carrying whether it has collapsed.
 */
export function Root({ iconic, ...rest }: RootProps): ReactElement {
  return <Columned {...rest} data-iconic={iconic === true ? "" : undefined} />;
}
