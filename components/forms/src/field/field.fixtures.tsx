/**
 * Builds the field a part's specification needs above it.
 */

import { type ReactElement, type ReactNode } from "react";

import * as Field from "#field/index.ts";
import { type RootProps } from "#field/root.tsx";

/**
 * Draws whatever a case wants measured inside the root that states the field's state.
 *
 * @param children - The part under test.
 * @param props - Whatever the case sets on the root.
 * @returns The root, holding it.
 */
export function fielded(children: ReactNode, props: RootProps = {}): ReactElement {
  return <Field.Root {...props}>{children}</Field.Root>;
}

/**
 * Draws a whole field, so a case can read what every part did.
 *
 * @param props - Whatever the case sets on the root.
 * @returns The six parts composed the way a caller composes them.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Field.Root {...props}>
      <Field.Label>
        Email
        <Field.RequiredIndicator />
      </Field.Label>
      <Field.Control type="email" />
      <Field.HelperText>We only write about invoices.</Field.HelperText>
      <Field.Counter>12 / 80</Field.Counter>
      <Field.ErrorText>That address is not one we recognise.</Field.ErrorText>
    </Field.Root>
  );
}
