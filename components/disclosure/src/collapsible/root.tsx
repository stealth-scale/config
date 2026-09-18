/**
 * Draws the frame the trigger and the block sit in, and runs the machine they share.
 *
 * @remarks
 *   The element is `div` and carries no role. A disclosure is a button and the block it shows, and
 *   both of those carry their own meaning, so a role on the pair would announce a thing that is not
 *   there.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#collapsible/context.ts";
import {
  ApiProvider,
  type CollapsibleOptions,
  splitCollapsibleProps,
  useCollapsibleMachine,
} from "#collapsible/machine.ts";

/**
 * Draws the frame and sets the variants every part below it reads.
 */
const Framed = withProvider("div", "root");

/**
 * Describes what the root takes: the machine's options, the recipe's variants, and the element's.
 *
 * @remarks
 *   The element's own `id` and `dir` are left out, because the machine states both. It builds every
 *   ARIA reference from the id, and it reads the direction to decide which way the block opens.
 */
export interface RootProps
  extends CollapsibleOptions, Omit<ComponentProps<typeof Framed>, "dir" | "id"> {}

/**
 * Shows and hides the block beneath a control.
 *
 * @param props - The machine's options, the recipe's variants and the element's props together.
 * @returns The frame, holding the parts, under the running machine.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitCollapsibleProps(props);
  const api = useCollapsibleMachine(options);

  return (
    <ApiProvider value={api}>
      <Framed {...rest} {...api.getRootProps()} />
    </ApiProvider>
  );
}
