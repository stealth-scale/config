/**
 * States what the signup form collects, as a JSON Schema document naming the format and the
 * keyword the engine registers, and the type the page reads its values under.
 */

import { type Schema } from "@stealthscale/provider-form";

/**
 * Describes what the signup form collects.
 */
export interface Signup {
  /**
   * The password, typed again.
   */
  readonly confirm: string;

  /**
   * Whether the account is for a business or an individual.
   */
  readonly kind: string;

  /**
   * The password.
   */
  readonly password: string;

  /**
   * The name the account is known by.
   */
  readonly username: string;

  /**
   * The VAT number, which a business states and an individual does not have.
   */
  readonly vat?: string | undefined;
}

/**
 * The schema the signup form is generated from.
 *
 * @remarks
 *   `confirm` writes `x-matches: "password"`, a keyword the engine registers. `vat` exists only
 *   where `kind` is `business`, so the conditional declares it, requires it and gives it its
 *   format, and the form draws it for a business alone. The two passwords state
 *   `format: "password"`, which draws a password box and keeps them out of any draft.
 */
export const signup: Schema = {
  allOf: [
    {
      if: { properties: { kind: { const: "business" } }, required: ["kind"] },
      // eslint-disable-next-line unicorn/no-thenable -- then is the JSON Schema keyword, and no promise reads it
      then: {
        properties: { vat: { format: "vat-number", minLength: 1, type: "string" } },
        required: ["vat"],
      },
    },
  ],
  properties: {
    confirm: { format: "password", type: "string", "x-matches": "password" },
    kind: { enum: ["business", "individual"], type: "string" },
    password: { format: "password", minLength: 8, type: "string" },
    username: { minLength: 3, pattern: "^[a-z0-9]+$", type: "string" },
  },
  required: ["confirm", "kind", "password", "username"],
  type: "object",
  "x-form": { id: "signup" },
};
