/**
 * Runs the machine the control and the panel share, and hands the recipe's variants to both.
 *
 * @remarks
 *   The machine names no root part, because a popover is a control and a panel that floats beside
 *   it rather than a thing that frames the two. An element is drawn here all the same, because the
 *   two are siblings and a slot recipe hands its variants down from above them both.
 *   It is drawn with `display: contents`, so it takes part in no layout and a popover attached to a
 *   control inside a row leaves that row as it was. The machine writes nothing onto it, there being
 *   no root among its parts.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#popover/context.ts";
import {
  ApiProvider,
  type PopoverOptions,
  splitPopoverProps,
  usePopoverMachine,
} from "#popover/machine.ts";

/**
 * Draws the element that sets the variants every part below it reads, and no box.
 */
const Framed = withProvider("div", "root");

/**
 * Describes what the root takes: the machine's settings, the recipe's variants, and the element's.
 *
 * @remarks
 *   The element's own `id` and `dir` are left out, because the machine states both. It names every
 *   part from the id, and it reads the direction to decide which side the panel opens on.
 */
export interface RootProps
  extends Omit<ComponentProps<typeof Framed>, "dir" | "id">, PopoverOptions {}

/**
 * Opens a panel beside a control.
 *
 * @param props - The machine's settings, the recipe's variants and the element's props together.
 * @returns The parts, under the running machine.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitPopoverProps(props);
  const api = usePopoverMachine(options);

  return (
    <ApiProvider value={api}>
      <Framed {...rest} />
    </ApiProvider>
  );
}
