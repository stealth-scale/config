/**
 * The rule across two fields of the signup form, written as a form validator.
 */

import { type GlobalFormValidationError } from "@stealthscale/provider-form";

import { type Signup } from "#schema.ts";

/**
 * Describes what a form validator is handed.
 */
export interface Submitted {
  /**
   * The values as they are now.
   */
  readonly value: Signup;
}

/**
 * Refuses a password that contains the username, which is a rule across two fields and so a
 * form validator, marking the field a person can act on.
 */
export function apart({ value }: Submitted): GlobalFormValidationError<Signup> | undefined {
  return value.username !== "" && value.password.includes(value.username)
    ? { fields: { password: { keyword: "containsUsername" } } }
    : undefined;
}
