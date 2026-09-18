import { describe, expect, it } from "vitest";

import { type Schema } from "#schema.ts";
import { formatsIn, isSchema, pathsIn, sensitivePaths, walk } from "#walk.ts";

const checkout: Schema = {
  allOf: [
    {
      else: { properties: { dateOfBirth: { format: "date", type: "string" } } },
      if: { properties: { kind: { const: "business" } } },
      // eslint-disable-next-line unicorn/no-thenable -- then is the JSON Schema keyword, and no promise reads it
      then: { properties: { vatNumber: { format: "vat-number", type: "string" } } },
    },
  ],
  dependentSchemas: { kind: { properties: { note: { type: "string" } } } },
  oneOf: [
    { properties: { card: { type: "string" } } },
    { properties: { iban: { type: "string" } } },
  ],
  properties: {
    billing: { properties: { city: { type: "string" } }, type: "object" },
    kind: { enum: ["business", "individual"] },
    lines: { items: { properties: { amount: { type: "number" } }, type: "object" }, type: "array" },
    password: { format: "password", type: "string" },
    secret: { type: "string", "x-persist": false },
    tags: { items: { type: "string" }, type: "array" },
  },
  type: "object",
};

describe("walk", () => {
  it("lists the path of every property any branch can produce", () => {
    expect(pathsIn(checkout)).toStrictEqual([
      "billing",
      "billing.city",
      "kind",
      "lines",
      "lines[]",
      "lines[].amount",
      "password",
      "secret",
      "tags",
      "tags[]",
      "vatNumber",
      "dateOfBirth",
      "card",
      "iban",
      "note",
    ]);
  });

  it("lists a property once when two branches declare it", () => {
    const twice: Schema = {
      anyOf: [{ properties: { a: { type: "string" } } }, { properties: { a: { type: "number" } } }],
    };

    expect(pathsIn(twice)).toStrictEqual(["a"]);
  });

  it("does not walk the condition of a conditional", () => {
    expect(pathsIn(checkout)).not.toContain("kind.const");
  });

  it("skips a member that is not a schema", () => {
    const odd: Schema = { items: 3, properties: { a: true, b: { type: "string" } } };

    expect(pathsIn(odd)).toStrictEqual(["b"]);
  });

  it("skips a branch that is not a schema", () => {
    const odd: Schema = {
      allOf: [true, { properties: { a: { type: "string" } } }],
      dependentSchemas: { a: false, b: { properties: { c: { type: "string" } } } },
      // eslint-disable-next-line unicorn/no-thenable -- then is the JSON Schema keyword, and no promise reads it
      then: 1,
    };

    expect(pathsIn(odd)).toStrictEqual(["a", "c"]);
  });

  it("calls back with the schema at each path", () => {
    const seen: string[] = [];

    walk({ properties: { a: { title: "A" } } }, (path, node) => {
      seen.push(`${path}:${String(node["title"])}`);
    });

    expect(seen).toStrictEqual(["a:A"]);
  });
});

describe("formatsIn", () => {
  it("lists every format the schema names once", () => {
    expect(formatsIn(checkout)).toStrictEqual(["password", "vat-number", "date"]);
  });

  it("lists a format the root names", () => {
    expect(formatsIn({ format: "vat-number", type: "string" })).toStrictEqual(["vat-number"]);
  });
});

describe("sensitivePaths", () => {
  it("lists a password and a property marked x-persist false", () => {
    expect(sensitivePaths(checkout)).toStrictEqual(["password", "secret"]);
  });
});

describe("isSchema", () => {
  it.each([
    { value: { type: "string" }, want: true },
    { value: [], want: false },
    { value: null, want: false },
    { value: "string", want: false },
  ])("answers $want for $value", ({ value, want }) => {
    expect(isSchema(value)).toBe(want);
  });
});
