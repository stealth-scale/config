import { describe, expect, it } from "vitest";

import { createEngine, defaultEngine, type Format, type Keyword } from "#engine.ts";
import { type Schema } from "#schema.ts";

const vatNumber: Format = { holds: (value) => /^[A-Z]{2}\d+$/u.test(value), name: "vat-number" };

const matches: Keyword = {
  holds: (parameter, value, values) =>
    typeof parameter === "string" &&
    typeof values === "object" &&
    values !== null &&
    Reflect.get(values, parameter) === value,
  name: "x-matches",
  on: ["string"],
};

const signup: Schema = {
  properties: {
    age: { default: 3, type: "number" },
    confirm: { type: "string", "x-matches": "password" },
    name: { minLength: 3, type: "string" },
    password: { type: "string" },
    tags: { items: { type: "string" }, type: "array" },
    vat: { format: "vat-number", type: "string" },
  },
  required: ["name"],
  type: "object",
};

const conditional: Schema = {
  allOf: [
    {
      else: { properties: { dateOfBirth: { type: "string" } }, required: ["dateOfBirth"] },
      if: { properties: { kind: { const: "business" } } },
      // eslint-disable-next-line unicorn/no-thenable -- then is the JSON Schema keyword, and no promise reads it
      then: { properties: { vatNumber: { type: "string" } }, required: ["vatNumber"] },
    },
  ],
  properties: { kind: { enum: ["business", "individual"] } },
  required: ["kind"],
  type: "object",
};

const engine = createEngine({ formats: [vatNumber], keywords: [matches] });

describe("createEngine", () => {
  it("builds every property with the defaults applied and the values given kept", () => {
    expect(engine.defaults(signup, { name: "Roy" })).toStrictEqual({
      age: 3,
      confirm: "",
      name: "Roy",
      password: "",
      tags: [],
      vat: "",
    });
  });

  it("starts an enum and a const nobody defaulted from the empty value of the type", () => {
    const choices: Schema = {
      properties: {
        consent: { const: true, type: "boolean" },
        plan: { default: "free", enum: ["free", "pro"], type: "string" },
        topic: { enum: ["sales", "support"], type: "string" },
      },
      type: "object",
    };

    expect(engine.defaults(choices)).toStrictEqual({ consent: false, plan: "free", topic: "" });
    expect(engine.defaults(choices, { topic: "sales" })).toStrictEqual({
      consent: false,
      plan: "free",
      topic: "sales",
    });
    expect(engine.defaults({ enum: ["sales", "support"], type: "string" })).toBe("");
  });

  it("reports a registered format that refuses as a format issue", () => {
    expect(engine.validate(signup, { name: "Roy", vat: "nl" })).toStrictEqual([
      expect.objectContaining({
        keyword: "format",
        path: ["vat"],
        values: { format: "vat-number" },
      }),
    ]);
  });

  it("reports no issue for a value a registered format accepts", () => {
    expect(engine.validate(signup, { name: "Roy", vat: "NL123" })).toStrictEqual([]);
  });

  it("hands a keyword the whole value beside its own", () => {
    expect(engine.validate(signup, { confirm: "a", name: "Roy", password: "b" })).toStrictEqual([
      expect.objectContaining({
        keyword: "x-matches",
        path: ["confirm"],
        values: { parameter: "password" },
      }),
    ]);
    expect(engine.validate(signup, { confirm: "b", name: "Roy", password: "b" })).toStrictEqual([]);
  });

  it("runs a keyword on the types it names alone", () => {
    expect(
      engine.validate(
        { properties: { n: { type: "number", "x-matches": "m" } }, type: "object" },
        { m: 1, n: 2 },
      ),
    ).toStrictEqual([]);
  });

  it("maps the library's own error to the keyword and the path", () => {
    expect(engine.validate(signup, { name: "ab" })).toStrictEqual([
      expect.objectContaining({
        keyword: "minLength",
        path: ["name"],
        values: { length: 2, minLength: 3 },
      }),
    ]);
  });

  it("throws when the schema names a format nobody registered", () => {
    expect(() => {
      engine.check({ properties: { a: { format: "nobody", type: "string" } } });
    }).toThrow(/"nobody"/u);
  });

  it("passes a check for the draft's own formats and the registered ones", () => {
    expect(() => {
      engine.check({ properties: { a: { format: "email" }, b: { format: "vat-number" } } });
    }).not.toThrow();
  });

  it("accepts every string under the password format", () => {
    expect(() => {
      engine.check({ format: "password", type: "string" });
    }).not.toThrow();
    expect(engine.validate({ format: "password", type: "string" }, "anything")).toStrictEqual([]);
  });

  it("resolves a conditional against the values in hand", () => {
    const business = engine.resolve(conditional, { kind: "business" });
    const individual = engine.resolve(conditional, { kind: "individual" });

    expect(business["required"]).toStrictEqual(["kind", "vatNumber"]);
    expect(Object.keys(individual["properties"] as object)).toStrictEqual(["kind", "dateOfBirth"]);
  });

  it("resolves an unanswered oneOf to the properties every branch shares", () => {
    const schema: Schema = {
      oneOf: [
        { properties: { kind: { const: "a" }, x: { type: "string" } }, required: ["kind"] },
        { properties: { kind: { const: "b" }, y: { type: "string" } }, required: ["kind"] },
      ],
      properties: { kind: { enum: ["a", "b"] } },
      type: "object",
    };

    expect(engine.resolve(schema, {})).toStrictEqual({
      properties: { kind: { enum: ["a", "b"] } },
      type: "object",
    });
    expect(
      Object.keys(engine.resolve(schema, { kind: "a" })["properties"] as object),
    ).toStrictEqual(["kind", "x"]);
  });

  it("lists the paths of every branch", () => {
    expect(engine.paths(conditional)).toStrictEqual(["kind", "vatNumber", "dateOfBirth"]);
  });

  it("compiles a schema once", () => {
    const once = createEngine();
    const schema: Schema = { type: "object" };

    expect(once.validate(schema, {})).toStrictEqual([]);
    expect(once.validate(schema, {})).toStrictEqual([]);
  });
});

describe("defaultEngine", () => {
  it("returns one engine however many times it is called", () => {
    expect(defaultEngine()).toBe(defaultEngine());
  });

  it("evaluates a schema with the draft's own formats", () => {
    expect(defaultEngine().validate({ format: "email", type: "string" }, "nobody")).toStrictEqual([
      expect.objectContaining({ keyword: "format", path: [] }),
    ]);
  });
});
