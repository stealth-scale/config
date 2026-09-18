/**
 * States what the profile form edits and the two steps it is drawn in, as a JSON Schema
 * document, and the type the page reads its values under.
 */

import { type Schema } from "@stealthscale/provider-form";

/**
 * Describes what the profile form edits: the saved profile without its identifier, and a new
 * password that is saved elsewhere.
 */
export interface ProfileValues {
  /**
   * A few lines about the person.
   */
  readonly bio: string;

  /**
   * The address the person is reached at.
   */
  readonly email: string;

  /**
   * The person's name.
   */
  readonly name: string;

  /**
   * A new password, or an empty string to keep the old one.
   */
  readonly newPassword: string;
}

/**
 * The schema the profile form is generated from.
 *
 * @remarks
 *   `newPassword` states `format: "password"`, which the draft reads as a value it never keeps.
 *   `x-persist: false` on any property does the same for a value that is not a password. The
 *   root's `x-form` names the form `profile` and lists the two steps of the wizard.
 */
export const profile: Schema = {
  properties: {
    bio: { maxLength: 300, type: "string" },
    email: { format: "email", minLength: 1, type: "string" },
    name: { minLength: 2, type: "string" },
    newPassword: { format: "password", type: "string" },
  },
  required: ["email", "name"],
  type: "object",
  "x-form": {
    id: "profile",
    steps: {
      kind: "wizard",
      of: [
        { name: "who", of: ["name", "email"] },
        { name: "about", of: ["bio", "newPassword"] },
      ],
    },
  },
};
