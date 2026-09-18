import { type StandardJSONSchemaV1 } from "@standard-schema/spec";
import { describe, expect, it } from "vitest";

import { DRAFT, type Schema, schemaOf } from "#schema.ts";

const document: Schema = { properties: { email: { type: "string" } }, type: "object" };

/**
 * Builds a library object that converts itself the way zod does.
 */
function library(input: StandardJSONSchemaV1.Converter["input"]): StandardJSONSchemaV1 {
  return { "~standard": { jsonSchema: { input, output: input }, vendor: "spec", version: 1 } };
}

describe("schemaOf", () => {
  it("returns a document as it is", () => {
    expect(schemaOf(document)).toBe(document);
  });

  it("converts a library object at the draft this design targets", () => {
    const converted = schemaOf(library((options) => ({ ...document, target: options.target })));

    expect(converted).toStrictEqual({ ...document, target: DRAFT });
  });

  it("returns a document holding a ~standard member with no converter as it is", () => {
    const odd: Schema = { "~standard": { vendor: "none" }, type: "object" };

    expect(schemaOf(odd)).toBe(odd);
  });

  it("returns a document holding a null ~standard member as it is", () => {
    const odd: Schema = { "~standard": null, type: "object" };

    expect(schemaOf(odd)).toBe(odd);
  });

  it("propagates the library's refusal of the draft", () => {
    const refusing = library(() => {
      throw new Error("draft-2020-12 is not supported");
    });

    expect(() => schemaOf(refusing)).toThrow(/not supported/u);
  });
});
