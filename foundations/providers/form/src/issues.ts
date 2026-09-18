/**
 * Converts what the engine's library reports into the issue a form reads.
 */

import { type JsonError } from "json-schema-library";

import { type Segment, segmentsOf } from "#path.ts";

/**
 * Describes one thing a schema refused, as the form reads it.
 *
 * @remarks
 *   The shape is a Standard Schema issue with the keyword and the values beside the message, so
 *   the form library puts it on the field at its path as it is, and the frame reads the keyword
 *   for the message identifier and the values for what the message reads.
 */
export interface Issue {
  /**
   * The JSON Schema keyword that refused, as the identifier reads it: `minLength`, `format`,
   * `required`.
   */
  readonly keyword: string;

  /**
   * The engine's own words, which are the development text.
   */
  readonly message: string;

  /**
   * The path to the value, segment by segment: `["lines", 0, "amount"]`. Empty for the root.
   */
  readonly path: readonly Segment[];

  /**
   * The values a message reads, under the engine's names: `minLength`, `length`, `minimum`.
   */
  readonly values: Readonly<Record<string, unknown>>;
}

/**
 * The code the library reports a missing required property under, at the pointer of the object
 * rather than of the property.
 */
const REQUIRED = "required-property-error";

/**
 * Matches the suffix every error code of the library ends with.
 */
const ERROR_SUFFIX = /-error$/u;

/**
 * Matches a hyphen and the letter after it, which a keyword writes in camel case.
 */
const HYPHENATED = /-([a-z])/gu;

/**
 * Derives the JSON Schema keyword an error code stands for.
 *
 * @remarks
 *   The library writes `min-length-error` for `minLength`. A format's code names the format, and
 *   every one of them reads as `format`, because that is the keyword the schema wrote.
 */
export function keywordOf(code: string): string {
  if (code.startsWith("format-")) return "format";

  if (code === REQUIRED) return "required";

  return code
    .replace(ERROR_SUFFIX, "")
    .replaceAll(HYPHENATED, (_, letter: string) => letter.toUpperCase());
}

/**
 * Places an issue on the property it is about, which for a missing required property is the one
 * the library names in `key` under the object's own pointer.
 */
function placed(
  code: string,
  at: readonly Segment[],
  values: Readonly<Record<string, unknown>>,
): readonly Segment[] {
  const missing = values["key"];

  return code === REQUIRED && typeof missing === "string" ? [...at, missing] : at;
}

/**
 * Converts one error the library reported into an issue.
 *
 * @remarks
 *   The library's `data` carries the pointer, the schema and the value beside what the keyword
 *   measured. The pointer becomes the path and the rest become the values a message reads. An
 *   error a keyword of this design created names the keyword itself, which is read ahead of the
 *   code. A missing required property is reported at the object's pointer with the property in
 *   `key`, and the issue is placed on the property.
 */
export function issueOf(error: JsonError): Issue {
  const { pointer, schema: _schema, value: _value, ...rest } = error.data;
  const { keyword, ...values } = rest;
  const code = typeof error.code === "string" ? error.code : "unknown-error";

  return {
    keyword: typeof keyword === "string" ? keyword : keywordOf(code),
    message: error.message,
    path: placed(code, segmentsOf(pointer), values),
    values,
  };
}
