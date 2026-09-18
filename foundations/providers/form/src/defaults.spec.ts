import { describe, expect, it } from "vitest";

import { defaultsOf } from "#defaults.ts";
import { createEngine } from "#engine.ts";
import { type Schema } from "#schema.ts";

interface Signup {
  age: number;
  name: string;
  tags: string[];
}

const signup: Schema = {
  properties: {
    age: { default: 3, type: "number" },
    name: { type: "string" },
    tags: { items: { type: "string" }, type: "array" },
  },
  type: "object",
};

describe("defaultsOf", () => {
  it("builds every property with the defaults applied", () => {
    expect(defaultsOf<Signup>(signup)).toStrictEqual({ age: 3, name: "", tags: [] });
  });

  it("keeps the values given over the defaults", () => {
    expect(defaultsOf<Signup>(signup, { name: "Roy" })).toStrictEqual({
      age: 3,
      name: "Roy",
      tags: [],
    });
  });

  it("reads the schema through the engine given", () => {
    expect(defaultsOf<Signup>(signup, { age: 7 }, createEngine())).toStrictEqual({
      age: 7,
      name: "",
      tags: [],
    });
  });
});
