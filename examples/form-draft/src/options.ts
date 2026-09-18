/**
 * The options every part of the profile form is built with, stated once so the form and the
 * steps drawn over it with `withForm` share one type.
 */

import { defaultsOf, formDefaults, formOptions, standardOf } from "@stealthscale/provider-form";

import { profile, type ProfileValues } from "#schema.ts";

/**
 * Builds the profile form's options from the house defaults, the schema's defaults to start
 * from, and the schema in the dynamic slot.
 */
export const profileOptions = formOptions({
  ...formDefaults,
  defaultValues: defaultsOf<ProfileValues>(profile),
  validators: { onDynamic: standardOf<ProfileValues>(profile) },
});

/**
 * Does nothing, which is what a step is handed for a callback before the page states one.
 *
 * @remarks
 *   `withForm` reads the type of a step's own props off the defaults it is given, so a callback
 *   prop needs a default, and a step rendered without the page around it calls this.
 */
export function nothing(): void {
  // The page states what the callback does.
}
