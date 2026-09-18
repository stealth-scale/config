/**
 * The words the profile form reads.
 */

import { translateFrom } from "@stealthscale/provider-form";

/**
 * The words the form reads. Every other word falls back to the path written out.
 */
export const words = translateFrom({
  "profile.actions.submit": "Save",
  "profile.errors.email.format": "Enter an address like name@example.com",
  "profile.errors.email.minLength": "Enter your email address",
  "profile.errors.name.minLength": "Enter at least two characters",
  "profile.fields.bio.label": "About you",
  "profile.fields.newPassword.description": "Leave it empty to keep your password",
  "profile.fields.newPassword.label": "New password",
  "profile.steps.about.label": "About",
  "profile.steps.who.label": "Who you are",
});
