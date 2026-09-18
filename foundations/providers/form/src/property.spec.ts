import { describe, expect, it } from "vitest";

import { bound, choicesOf, countAt, propertyOf, requiredIn, textOf, valueAt } from "#property.ts";
import { type Schema } from "#schema.ts";

const checkout: Schema = {
  properties: {
    billing: {
      properties: { city: { title: "City", type: "string" } },
      required: ["city"],
      type: "object",
    },
    kind: { description: "Who is ordering", enum: ["business", 3, "individual"], type: "string" },
    lines: {
      items: {
        properties: { amount: { type: "number" }, tags: { items: { type: "string" } } },
        required: ["amount"],
      },
      type: "array",
    },
    name: { type: "string" },
  },
  required: ["name"],
  type: "object",
};

describe("propertyOf", () => {
  it("reads a property at the root and under an object", () => {
    expect(propertyOf(checkout, "name")).toStrictEqual({ type: "string" });
    expect(propertyOf(checkout, "billing.city")).toStrictEqual({ title: "City", type: "string" });
  });

  it("follows [] into an array's items", () => {
    expect(propertyOf(checkout, "lines[].amount")).toStrictEqual({ type: "number" });
    expect(propertyOf(checkout, "lines[].tags[]")).toStrictEqual({ type: "string" });
  });

  it("returns nothing where the schema has no property at the path", () => {
    expect(propertyOf(checkout, "billing.street")).toBeUndefined();
    expect(propertyOf(checkout, "name[]")).toBeUndefined();
    expect(propertyOf({ type: "object" }, "name")).toBeUndefined();
  });
});

describe("requiredIn", () => {
  it("reads the root's required list for a property at the root", () => {
    expect(requiredIn(checkout, "name")).toBe(true);
    expect(requiredIn(checkout, "kind")).toBe(false);
  });

  it("reads the holder's required list for a nested property", () => {
    expect(requiredIn(checkout, "billing.city")).toBe(true);
    expect(requiredIn(checkout, "lines[].amount")).toBe(true);
    expect(requiredIn(checkout, "lines[].tags")).toBe(false);
  });

  it("reports false where the holder is absent or lists nothing", () => {
    expect(requiredIn(checkout, "gone.city")).toBe(false);
    expect(requiredIn({ type: "object" }, "name")).toBe(false);
  });
});

describe("textOf", () => {
  it("reads a title and a description where the schema states them", () => {
    expect(textOf({ title: "City" }, "title")).toBe("City");
    expect(textOf({ description: "Who is ordering" }, "description")).toBe("Who is ordering");
  });

  it("returns nothing where the keyword is absent or not a string", () => {
    expect(textOf({ type: "string" }, "title")).toBeUndefined();
    expect(textOf({ title: 3 }, "title")).toBeUndefined();
  });
});

describe("choicesOf", () => {
  it("lists the strings of an enum", () => {
    expect(choicesOf(propertyOf(checkout, "kind") ?? {})).toStrictEqual(["business", "individual"]);
  });

  it("lists nothing for a schema without an enum", () => {
    expect(choicesOf({ type: "string" })).toStrictEqual([]);
  });
});

describe("valueAt", () => {
  it("reads a value by a dotted name and an indexed one", () => {
    const values = { billing: { city: "Delft" }, lines: [{ amount: 1 }, { amount: 2 }] };

    expect(valueAt(values, "billing.city")).toBe("Delft");
    expect(valueAt(values, "lines[1].amount")).toBe(2);
  });

  it("returns nothing where the name reaches nothing", () => {
    expect(valueAt({ name: "Roy" }, "name.first")).toBeUndefined();
    expect(valueAt(undefined, "name")).toBeUndefined();
  });
});

describe("countAt", () => {
  it("counts the items of an array", () => {
    expect(countAt({ lines: [{}, {}, {}] }, "lines")).toBe(3);
    expect(countAt({ a: [{ b: [1] }] }, "a[0].b")).toBe(1);
  });

  it("counts zero where there is no array", () => {
    expect(countAt({ lines: "none" }, "lines")).toBe(0);
    expect(countAt({}, "lines")).toBe(0);
  });
});

describe("bound", () => {
  it("writes each index into the path in order", () => {
    expect(bound("lines[].amount", [2])).toBe("lines[2].amount");
    expect(bound("a[].b[].c", [0, 3])).toBe("a[0].b[3].c");
  });

  it("leaves a path outside a repeat group and a [] with no index as they are", () => {
    expect(bound("name", [])).toBe("name");
    expect(bound("a[].b[].c", [1])).toBe("a[1].b[].c");
  });
});
