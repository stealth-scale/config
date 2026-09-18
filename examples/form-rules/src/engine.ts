/**
 * Builds the engine every form on the page validates with: the draft's own formats and keywords,
 * plus a format and a keyword this product registers once.
 */

import { createEngine, type Format, type Keyword } from "@stealthscale/provider-form";

/**
 * Matches a VAT number: two letters for the country and then eight to twelve letters or digits.
 */
const VAT = /^[A-Z]{2}[\dA-Z]{8,12}$/u;

/**
 * Accepts a VAT number, written as `format: "vat-number"` in any schema on the page.
 *
 * @remarks
 *   An empty string passes, as it does the draft's own formats. Whether a value may be empty is
 *   `minLength`'s to say, so a schema states both where a VAT number has to be given.
 */
export const vatNumber: Format = {
  holds: (value) => value === "" || VAT.test(value),
  name: "vat-number",
};

/**
 * Reports whether a value is an object a property can be read off.
 */
function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null;
}

/**
 * Accepts a value equal to the value of the property it names, written as
 * `"x-matches": "<property>"` in any schema on the page. A confirmation reads the password with it.
 */
export const matches: Keyword = {
  holds: (parameter, value, values) =>
    typeof parameter === "string" && isRecord(values) && values[parameter] === value,
  name: "x-matches",
  on: ["string"],
};

/**
 * The engine, built once for the page and handed to `FormProvider`.
 */
export const engine = createEngine({ formats: [vatNumber], keywords: [matches] });
