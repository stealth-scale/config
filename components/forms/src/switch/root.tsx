/**
 * Draws the label the track and the words sit in, and runs the machine they share.
 *
 * @remarks
 *   The element is `label` and points at the input this part draws beside the caller's children,
 *   so a press anywhere on the row throws the switch and the whole row is one target. The input is
 *   the control a screen reader reads and the value a form submits. It is drawn here rather than
 *   published as a part, because a switch that omits it reports nothing to a form and nothing to a
 *   reader, and a part a caller has to remember is a part a caller forgets.
 *   The input carries `role="switch"`. The machine draws it as a checkbox and states no role, so a
 *   reader announced a switch as a checkbox and read its state as checked rather than on. ARIA in
 *   HTML allows the role on a checkbox input, which is the pattern the APG names.
 *   A switch inside a field takes that field's state and is described by its texts. The field's
 *   values are read before the caller's, so a switch that states its own overrides the field.
 */

import { type ComponentProps, type ReactElement } from "react";

import { describedBy } from "#field/ids.ts";
import { useOptionalField } from "#field/state.ts";
import { withProvider } from "#switch/context.ts";
import {
  ApiProvider,
  splitSwitchProps,
  type SwitchOptions,
  useSwitchMachine,
} from "#switch/machine.ts";

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
  extends Omit<ComponentProps<typeof Framed>, "htmlFor" | keyof SwitchOptions>, SwitchOptions {}

/**
 * Throws a value on and off.
 *
 * @param props - The machine's options, the recipe's variants and the element's props together.
 * @returns The row, holding the parts and the input a form reads.
 */
export function Root(props: RootProps): ReactElement {
  const field = useOptionalField();
  const [options, rest] = splitSwitchProps(props);
  const { children, ...attributes } = rest;
  const api = useSwitchMachine({
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
          aria-checked={api.checked}
          role="switch"
        />
      </Framed>
    </ApiProvider>
  );
}
