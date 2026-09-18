/**
 * Draws the label the box and the words sit in, and runs the machine they share.
 *
 * @remarks
 *   The element is `label` and points at the input this part draws beside the caller's children,
 *   so a press anywhere on the row toggles the box and the whole row is one target. The input is
 *   the checkbox a screen reader reads and the value a form submits. It is drawn here rather than
 *   published as a part, because a checkbox that omits it reports nothing to a form and nothing to
 *   a reader, and a part a caller has to remember is a part a caller forgets.
 *   The box itself is `aria-hidden`. The input carries the state, so a reader is told the checkbox
 *   is checked once rather than twice.
 *   A checkbox inside a field takes that field's state and is described by its texts. The field's
 *   values are read before the caller's, so a checkbox that states its own overrides the field.
 *   The partly-on state is written onto the input on every commit. The machine writes it when the
 *   state changes and not when it mounts, so a checkbox drawn partly on would otherwise be
 *   announced as unchecked. It is a property rather than `aria-checked`, because a native checkbox
 *   takes `aria-checked` only where it already agrees with the element, which axe reports as
 *   `aria-conditional-attr`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { withProvider } from "#checkbox/context.ts";
import {
  ApiProvider,
  type CheckboxOptions,
  splitCheckboxProps,
  useCheckboxMachine,
} from "#checkbox/machine.ts";
import { describedBy } from "#field/ids.ts";
import { useOptionalField } from "#field/state.ts";

/**
 * Draws the row and sets the variants every part below it reads.
 */
const Framed = withProvider("label", "root");

/**
 * Describes what the root takes: the machine's options, the recipe's variants, and the element's.
 *
 * @remarks
 *   Every prop the machine owns is taken off the element's, so the two never offer one name under
 *   two types. `htmlFor` goes with them: the machine states it, pointing the label at the input it
 *   draws.
 */
export interface RootProps
  extends CheckboxOptions, Omit<ComponentProps<typeof Framed>, "htmlFor" | keyof CheckboxOptions> {}

/**
 * Toggles a value a person turns on and off.
 *
 * @param props - The machine's options, the recipe's variants and the element's props together.
 * @returns The row, holding the parts and the input a form reads.
 */
export function Root(props: RootProps): ReactElement {
  const field = useOptionalField();
  const [options, rest] = splitCheckboxProps(props);
  const { children, ...attributes } = rest;
  const api = useCheckboxMachine({
    disabled: field?.disabled,
    invalid: field?.invalid,
    readOnly: field?.readOnly,
    required: field?.required,
    ...options,
  });

  return (
    <ApiProvider value={api}>
      <Framed {...attributes} {...api.getRootProps()}>
        {children}
        <input
          aria-describedby={field ? describedBy(field.ids) : undefined}
          {...api.getHiddenInputProps()}
          ref={(node) => {
            if (node !== null) {
              node.indeterminate = api.indeterminate;
            }
          }}
        />
      </Framed>
    </ApiProvider>
  );
}
