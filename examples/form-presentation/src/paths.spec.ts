import { describe, expect, it } from "vitest";

import { wordsOf } from "@stealthscale/example-form-fields";
import { translateFrom } from "@stealthscale/provider-form";

import {
  bound,
  countAt,
  keyOf,
  layoutOf,
  legendOf,
  OUTSIDE,
  propertyOf,
  requiredIn,
} from "#paths.ts";
import { checkout } from "#schema.ts";

describe("propertyOf", () => {
  it("reads a nested property and an array's item property", () => {
    expect(propertyOf(checkout, "billing.city")).toStrictEqual({
      minLength: 1,
      type: "string",
      "x-span": 2,
    });
    expect(propertyOf(checkout, "lines[].amount")?.["minimum"]).toBe(1);
    expect(propertyOf(checkout, "lines[]")?.["type"]).toBe("object");
  });

  it("answers nothing for a path the schema lacks", () => {
    expect(propertyOf(checkout, "billing.street")).toBeUndefined();
    expect(propertyOf(checkout, "name.first")).toBeUndefined();
    expect(propertyOf(checkout, "name[]")).toBeUndefined();
  });
});

describe("requiredIn", () => {
  it("reads whether the schema holding a property requires it", () => {
    expect(requiredIn(checkout, "name")).toBe(true);
    expect(requiredIn(checkout, "notes")).toBe(false);
    expect(requiredIn(checkout, "billing.city")).toBe(true);
    expect(requiredIn(checkout, "lines[].amount")).toBe(true);
    expect(requiredIn(checkout, "gone.city")).toBe(false);
  });
});

describe("countAt", () => {
  it("counts the items of an array at a path and answers zero elsewhere", () => {
    expect(countAt({ lines: [1, 2] }, "lines")).toBe(2);
    expect(countAt({ order: { lines: [1] } }, "order.lines")).toBe(1);
    expect(countAt({ lines: "no" }, "lines")).toBe(0);
    expect(countAt(null, "lines")).toBe(0);
  });
});

describe("bound", () => {
  it("writes the index into the first empty brackets and leaves a path outside a group alone", () => {
    expect(bound("lines[].amount", 2)).toBe("lines[2].amount");
    expect(bound("name", OUTSIDE)).toBe("name");
    expect(bound("name", 1)).toBe("name");
  });
});

describe("keyOf", () => {
  it("keys a group by its name or by what it holds", () => {
    expect(keyOf({ name: "who", of: ["a"] })).toBe("who");
    expect(keyOf({ of: ["a", { of: ["b"] }] })).toBe('["a",{"of":["b"]}]');
  });
});

describe("layoutOf", () => {
  it("picks a grid for columns and a row for the direction and a column otherwise", () => {
    expect(layoutOf({ columns: 3, of: [] })).toBe("grid columns-3");
    expect(layoutOf({ direction: "row", of: [] })).toBe("row");
    expect(layoutOf({ of: [] })).toBe("column");
  });
});

describe("legendOf", () => {
  const translate = translateFrom({
    "checkout.groups.who.legend": "Who is ordering",
    "shared.legend": "Shared",
  });
  const words = wordsOf(translate, "checkout");

  it("resolves the legend from the group's name or from the identifier it names", () => {
    expect(legendOf({ legend: true, name: "who", of: [] }, words, translate)).toBe(
      "Who is ordering",
    );
    expect(legendOf({ legend: true, of: [] }, words, translate)).toBe("");
    expect(legendOf({ legend: "shared.legend", of: [] }, words, translate)).toBe("Shared");
  });

  it("answers nothing where the group draws no fieldset", () => {
    expect(legendOf({ of: [] }, words, translate)).toBeUndefined();
    expect(legendOf({ legend: false, of: [] }, words, translate)).toBeUndefined();
  });
});
