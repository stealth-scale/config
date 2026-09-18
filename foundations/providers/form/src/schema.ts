/**
 * Reads the JSON Schema document a form works from, whatever a caller has.
 */

import { type StandardJSONSchemaV1 } from "@standard-schema/spec";

/**
 * Describes a JSON Schema document, as this design system works from it.
 */
export type Schema = Readonly<Record<string, unknown>>;

/**
 * The draft every schema is written to, and every library object is converted to.
 */
export const DRAFT = "draft-2020-12";

/**
 * Reports whether a source is a library object that converts itself to JSON Schema.
 *
 * @remarks
 *   The check is structural, so a library that implements the interface without importing the
 *   specification package is recognised, and a document that happens to hold a `~standard` member
 *   with no converter under it is read as a document.
 */
function isStandard(source: Schema | StandardJSONSchemaV1): source is StandardJSONSchemaV1 {
  if (!("~standard" in source)) return false;

  const standard: unknown = source["~standard"];

  return typeof standard === "object" && standard !== null && "jsonSchema" in standard;
}

/**
 * Reads a JSON Schema document out of whatever a caller has.
 *
 * @remarks
 *   A library object is converted through its own `~standard.jsonSchema.input` at the draft this
 *   design targets, and the library's refusal of that draft propagates as the library's own
 *   error. A document is returned as it is.
 * @returns The document, at draft 2020-12 where a library produced it.
 */
export function schemaOf(source: Schema | StandardJSONSchemaV1): Schema {
  if (!isStandard(source)) return source;

  return source["~standard"].jsonSchema.input({ target: DRAFT });
}
