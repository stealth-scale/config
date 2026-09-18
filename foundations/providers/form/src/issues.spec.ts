import { compileSchema, type JsonError } from "json-schema-library";
import { describe, expect, it } from "vitest";

import { issueOf, keywordOf } from "#issues.ts";

/**
 * Builds an error the way a keyword of this design creates one.
 */
function created(data: JsonError["data"]): JsonError {
  return { code: "keyword-x-matches-error", data, message: "refused", type: "error" };
}

describe("issueOf", () => {
  it("converts a minimum length error into an issue at the field's path", () => {
    const { errors } = compileSchema({
      properties: { lines: { items: { properties: { name: { minLength: 3, type: "string" } } } } },
    }).validate({ lines: [{ name: "ab" }] });

    const issues = errors.map((error) => issueOf(error));

    expect(issues).toStrictEqual([
      expect.objectContaining({
        keyword: "minLength",
        path: ["lines", 0, "name"],
        values: { length: 2, minLength: 3 },
      }),
    ]);
    expect(issues[0]?.message).toContain("minimum length");
  });

  it("reads the keyword an engine keyword named and keeps its parameter among the values", () => {
    const error = created({
      keyword: "x-matches",
      parameter: "b",
      pointer: "#/a",
      schema: {},
      value: "a",
    });

    expect(issueOf(error)).toStrictEqual({
      keyword: "x-matches",
      message: "refused",
      path: ["a"],
      values: { parameter: "b" },
    });
  });

  it("places a missing required property on the property", () => {
    const { errors } = compileSchema({
      properties: { billing: { properties: { city: { type: "string" } }, required: ["city"] } },
      required: ["name"],
      type: "object",
    }).validate({ billing: {} });

    expect(errors.map((error) => issueOf(error))).toStrictEqual([
      expect.objectContaining({
        keyword: "required",
        path: ["billing", "city"],
        values: { key: "city" },
      }),
      expect.objectContaining({ keyword: "required", path: ["name"], values: { key: "name" } }),
    ]);
  });

  it("reads an error whose code is not a name as unknown", () => {
    const error: JsonError = {
      code: {},
      data: { pointer: "#/a", schema: {}, value: 1 },
      message: "refused",
      type: "error",
    };

    expect(issueOf(error).keyword).toBe("unknown");
  });

  it("derives the keyword from the code when the error names none", () => {
    const error: JsonError = {
      code: "type-error",
      data: { pointer: "#/a", schema: {}, value: 1 },
      message: "refused",
      type: "error",
    };

    expect(issueOf(error)).toStrictEqual({
      keyword: "type",
      message: "refused",
      path: ["a"],
      values: {},
    });
  });
});

describe("keywordOf", () => {
  it.each([
    { code: "min-length-error", want: "minLength" },
    { code: "required-property-error", want: "required" },
    { code: "additional-properties-error", want: "additionalProperties" },
    { code: "format-date-error", want: "format" },
    { code: "format-vat-number-error", want: "format" },
    { code: "type-error", want: "type" },
  ])("derives $want from $code", ({ code, want }) => {
    expect(keywordOf(code)).toBe(want);
  });
});
