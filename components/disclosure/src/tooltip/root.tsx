/**
 * Runs the machine the control and the box share, and hands the recipe's variants to both.
 *
 * @remarks
 *   The machine names no root part, because a tooltip is a control and a box that floats beside it
 *   rather than a thing that frames the two. An element is drawn here all the same, because the
 *   two are siblings and a slot recipe hands its variants down from above them both.
 *   It is drawn with `display: contents`, so it takes part in no layout and a tooltip attached to a
 *   control inside a row leaves that row as it was. The machine writes nothing onto it, there being
 *   no root among its parts.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#tooltip/context.ts";
import {
  ApiProvider,
  splitTooltipProps,
  type TooltipOptions,
  useTooltipMachine,
} from "#tooltip/machine.ts";

/**
 * Draws the element that sets the variants every part below it reads, and no box.
 */
const Framed = withProvider("div", "root");

/**
 * Describes what the root takes: the machine's settings, the recipe's variants, and the element's.
 *
 * @remarks
 *   The element's own `id` and `dir` are left out, because the machine states both. It names the
 *   box from the id so the control can point at it, and it reads the direction to decide which side
 *   the box opens on.
 */
export interface RootProps
  extends Omit<ComponentProps<typeof Framed>, "dir" | "id">, TooltipOptions {}

/**
 * Shows a short label beside whatever a pointer rests on.
 *
 * @param props - The machine's settings, the recipe's variants and the element's props together.
 * @returns The parts, under the running machine.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitTooltipProps(props);
  const api = useTooltipMachine(options);

  return (
    <ApiProvider value={api}>
      <Framed {...rest} />
    </ApiProvider>
  );
}
