/**
 * Draws the checkout form over the shared options, with the fields drawn from the presentation
 * over the schema resolved against the values in hand.
 */

import { type ReactElement } from "react";

import { useAppForm } from "@stealthscale/example-form-fields";
import { useFormEnvironment, useSelector } from "@stealthscale/provider-form";

import { Fields } from "#fields.tsx";
import { checkoutOptions } from "#options.ts";
import { checkout, presentation } from "#schema.ts";

/**
 * Describes what the checkout form is given.
 */
export interface CheckoutFormProps {
  /**
   * Receives the values once the schema accepts them.
   */
  readonly onDone: (value: unknown) => void;
}

/**
 * Draws the checkout form.
 *
 * @remarks
 *   The schema is resolved against the values on every change, at a fifth of a millisecond, and
 *   the fields draw a member only where the resolved schema has it.
 */
export function CheckoutForm({ onDone }: CheckoutFormProps): ReactElement {
  const { engine } = useFormEnvironment();
  const form = useAppForm({
    ...checkoutOptions,
    onSubmit: ({ value }) => {
      onDone(value);
    },
  });
  const values = useSelector(form.store, (state) => state.values);
  const resolved = engine.resolve(checkout, values);

  return (
    <form.AppForm>
      <form.Form>
        <Fields form={form} presentation={presentation} resolved={resolved} />
        <form.Submit>Place order</form.Submit>
      </form.Form>
    </form.AppForm>
  );
}
