/**
 * States what the contact form collects and how it is drawn, as one JSON Schema document, and
 * the type the page reads its values under.
 */

import { type Schema } from "@stealthscale/provider-form";

/**
 * Describes what the contact form collects.
 */
export interface Contact {
  /**
   * Whether the person agreed to be contacted.
   */
  readonly consent: boolean;

  /**
   * The address the answer goes to.
   */
  readonly email: string;

  /**
   * The message, which may be empty.
   */
  readonly message: string;

  /**
   * The person's name.
   */
  readonly name: string;

  /**
   * Which team the message is for.
   */
  readonly topic: string;
}

/**
 * The schema the contact form is generated from.
 *
 * @remarks
 *   A string a person has to fill in states `minLength: 1`, because JSON Schema's `required`
 *   asks only that the property exist and every control starts from an empty string. The consent
 *   is `const: true`, so an unticked box refuses under the keyword `const`. The root's `x-form`
 *   states the identifier every word is read under and the two fieldsets the form is drawn in.
 */
export const contact: Schema = {
  properties: {
    consent: { const: true, type: "boolean" },
    email: { format: "email", minLength: 1, type: "string" },
    message: { maxLength: 200, type: "string" },
    name: { minLength: 2, type: "string" },
    topic: { enum: ["sales", "support"], type: "string" },
  },
  required: ["consent", "email", "name", "topic"],
  type: "object",
  "x-form": {
    id: "contact",
    of: [
      { legend: true, name: "who", of: ["name", "email"] },
      { legend: true, name: "what", of: ["topic", "message", "consent"] },
    ],
  },
};
