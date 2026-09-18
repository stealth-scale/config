/**
 * The options every part of the checkout form is built with, stated once so the form and the
 * fields drawn over it with `withForm` share one type.
 */

import { defaultsOf, formDefaults, formOptions, standardOf } from "@stealthscale/provider-form";

import { checkout } from "#schema.ts";

/**
 * Describes the values of a generated form, which has no type of its own.
 *
 * @remarks
 *   A record of unknown values rather than `unknown` itself, because the library types the array
 *   paths of a form over `unknown` as `never`, and a form handed to a component built with
 *   `withForm` has to name the same type on both sides.
 */
export type Values = Record<string, unknown>;

/**
 * Builds the checkout form's options from the house defaults, the schema's defaults with one
 * line to start from, and the schema in the dynamic slot.
 */
export const checkoutOptions = formOptions({
  ...formDefaults,
  defaultValues: defaultsOf<Values>(checkout, { lines: [{}] }),
  validators: { onDynamic: standardOf<Values>(checkout) },
});
