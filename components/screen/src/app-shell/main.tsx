/**
 * Draws the middle of the shell, which is the application.
 *
 * @remarks
 *   The element is `main`, which carries the `main` landmark. Draw one. A page inside it claims no
 *   landmark of its own, so a reader is offered one place where the application's work is.
 *   It goes inert while a panel is laid over the page, so the page under a backdrop takes neither a
 *   press nor a Tab. That is what makes the panel over it read as a sheet without the panel
 *   claiming a role it does not have.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withContext } from "#app-shell/context.ts";
import { useOverlaid } from "#app-shell/state.ts";

/**
 * Draws the middle at whatever room the panels leave.
 */
const Framed = withContext("main", "main");

/**
 * Describes what the middle takes.
 */
export type MainProps = ComponentProps<typeof Framed>;

/**
 * Draws the middle: whatever room the panels leave, scrolling on its own where the page scrolls.
 *
 * @param props - Everything a styled main takes.
 * @returns The middle of the shell.
 */
export function Main(props: MainProps): ReactElement {
  const sheets = useOverlaid();

  return <Framed {...props} inert={sheets.length > 0} />;
}
