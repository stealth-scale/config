/**
 * Draws the box a group of fields sits in.
 *
 * @remarks
 *   The element is `fieldset`, and `disabled` is its own attribute rather than something the
 *   component wires. A browser takes every control inside a disabled fieldset out of reach, out of
 *   the tab order and out of what a form submits, which is four behaviours for one attribute. The
 *   first `legend` stays reachable, which is the exception the specification makes and the reason
 *   a group can still be named while its controls are not.
 *   The state also goes down a context, because the browser disables the controls and not the
 *   labels beside them. A field inside the group draws itself as unreachable from that.
 *   The identifiers are derived from one, as a field's are, and the root is described by both of
 *   its texts. A screen reader that reads a group's description reads them; one that does not
 *   reaches them in document order instead, which is why they are drawn under the legend.
 *   The legend has to be the first child. A browser takes the first `legend` as the group's name
 *   and treats a later one as ordinary content, and nothing in a component can enforce the order a
 *   caller writes its children in.
 */

import { type ComponentProps, type ReactElement, useId, useMemo } from "react";

import { describedBy, idsOf } from "#field/ids.ts";
import { withProvider } from "#fieldset/context.ts";
import { FieldsetProvider, type FieldsetState } from "#fieldset/state.ts";

/**
 * Draws the box and sets the variants every part below it reads.
 */
const Framed = withProvider("fieldset", "root");

/**
 * Describes what a group takes: the recipe's variants, what it knows about itself, and everything
 * a styled fieldset takes.
 */
export interface RootProps extends ComponentProps<typeof Framed> {
  /**
   * Whether every control in the group is out of reach. Default: false.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Whether what the group holds is wrong. Default: false.
   */
  readonly invalid?: boolean | undefined;
}

/**
 * Draws the group, with its state in scope for its parts and the fields inside it.
 *
 * @param props - The variants, the group's state, and the element's own props.
 * @returns The box, holding the fields, under the state they read.
 */
export function Root({ disabled = false, id, invalid = false, ...rest }: RootProps): ReactElement {
  const generated = useId();
  const state = useMemo<FieldsetState>(
    () => ({ disabled, ids: idsOf(id ?? generated), invalid }),
    [disabled, generated, id, invalid],
  );

  return (
    <FieldsetProvider value={state}>
      <Framed
        aria-describedby={describedBy(state.ids)}
        aria-invalid={invalid || undefined}
        {...rest}
        data-invalid={invalid || undefined}
        disabled={disabled}
      />
    </FieldsetProvider>
  );
}
