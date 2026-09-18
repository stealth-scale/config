/**
 * Draws the frame the strip and the panels sit in, and runs the machine they share.
 *
 * @remarks
 *   The element is `div` and carries no role. The strip carries the tablist role, each control the
 *   tab role and each panel the tabpanel role, all written by the machine, so a role on the frame
 *   would announce a thing that is not there.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#tabs/context.ts";
import { ApiProvider, splitTabsProps, type TabsOptions, useTabsMachine } from "#tabs/machine.ts";

/**
 * Draws the frame and sets the variants every part below it reads.
 */
const Framed = withProvider("div", "root");

/**
 * Describes what the root takes: the machine's options, the recipe's variants, and the element's.
 *
 * @remarks
 *   The element's own `id` and `dir` are left out, because the machine states both. It builds every
 *   ARIA reference from the id, and it reads the direction to decide which arrow key moves which
 *   way.
 */
export interface RootProps
  extends
    Omit<ComponentProps<typeof Framed>, "defaultValue" | "dir" | "id" | "onChange" | "value">,
    TabsOptions {}

/**
 * Shows one panel at a time, chosen from a strip of controls.
 *
 * @param props - The machine's options, the recipe's variants and the element's props together.
 * @returns The frame, holding the parts, under the running machine.
 */
export function Root(props: RootProps): ReactElement {
  const [options, rest] = splitTabsProps(props);
  const api = useTabsMachine(options);

  return (
    <ApiProvider value={api}>
      <Framed {...rest} {...api.getRootProps()} />
    </ApiProvider>
  );
}
