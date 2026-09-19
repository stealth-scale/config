/**
 * Builds the fieldset a part's specification needs above it.
 */

import { type ReactElement, type ReactNode } from "react";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { type RootProps } from "#fieldset/root.tsx";

/**
 * Draws whatever a case wants measured inside the root that states the group's state.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the root.
 * @returns The root, holding it.
 */
export function grouped(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Fieldset.Root {...props}>{children}</Fieldset.Root>;
}

/**
 * Draws a whole group holding one field, so a case can read what the group hands down.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The four parts and a field composed the way a caller composes them.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Fieldset.Root {...props}>
      <Fieldset.Legend>Delivery</Fieldset.Legend>
      <Fieldset.HelperText>We deliver on weekdays.</Fieldset.HelperText>
      <Field.Root>
        <Field.Label>Address</Field.Label>
        <Field.Control />
      </Field.Root>
      <Fieldset.ErrorText>Choose one before going on.</Fieldset.ErrorText>
    </Fieldset.Root>
  );
}
