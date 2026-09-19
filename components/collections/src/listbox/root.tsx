/**
 * Draws the frame the label, the field and the list sit in, and runs the machine they share.
 *
 * @remarks
 *   The element is `div` and carries no role. The list inside it is the `listbox`, and a role on
 *   the frame around it would announce a second one that holds nothing.
 *   The collection is the caller's. It decides which rows exist and in what order, so a list that
 *   narrows as a person types hands a new collection rather than asking the machine to filter.
 */

import { type ComponentProps, type ReactElement, useId } from "react";

import { withProvider } from "#listbox/context.ts";
import {
  ApiProvider,
  type ListboxOptions,
  splitListboxProps,
  useListboxMachine,
} from "#listbox/machine.ts";

/**
 * Draws the frame and sets the variants every part below it reads.
 */
const Framed = withProvider("div", "root");

/**
 * Describes what the root takes: the machine's options, the recipe's variants, and the element's.
 *
 * @remarks
 *   Every prop the machine owns is taken off the element's, so the two never offer one name under
 *   two types.
 */
export interface RootProps
  extends ListboxOptions, Omit<ComponentProps<typeof Framed>, keyof ListboxOptions> {}

/**
 * Offers a set of rows a person picks from.
 *
 * @param props - The machine's options, the recipe's variants and the element's props together.
 * @returns The frame, holding the parts, under the running machine.
 */
export function Root({ id, ...props }: RootProps): ReactElement {
  const generated = useId();
  const [options, rest] = splitListboxProps({ ...props, id: id ?? generated });
  const api = useListboxMachine(options);

  return (
    <ApiProvider value={api}>
      <Framed {...rest} {...api.getRootProps()} />
    </ApiProvider>
  );
}
