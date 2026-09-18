/**
 * The words the signup form reads.
 */

import { translateFrom } from "@stealthscale/provider-form";

/**
 * The words the form reads. The keyword of a rule of our own, `taken` and `containsUsername`,
 * reads its words the way a schema keyword does.
 */
export const words = translateFrom({
  "errors.minLength": "Enter at least {{minLength}} characters",
  "signup.actions.submit": "Sign up",
  "signup.errors.confirm.x-matches": "The passwords differ",
  "signup.errors.kind.enum": "Choose one",
  "signup.errors.password.containsUsername": "Do not put your name in your password",
  "signup.errors.password.minLength": "Use eight characters or more",
  "signup.errors.username.minLength": "Use three characters or more",
  "signup.errors.username.pattern": "Use lower-case letters and digits",
  "signup.errors.username.taken": "That name is taken",
  "signup.errors.vat.format": "Enter a VAT number like NL123456789B01",
  "signup.errors.vat.minLength": "A business states its VAT number",
  "signup.fields.confirm.label": "Password again",
  "signup.fields.kind.label": "Account",
  "signup.fields.kind.options.business": "A business",
  "signup.fields.kind.options.individual": "An individual",
  "signup.fields.vat.label": "VAT number",
});
