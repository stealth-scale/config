import { describe, expect, it } from "vitest";

import { choicesOf, titleOf } from "#controls/schema.ts";

describe("titleOf", () => {
  it("reads a title and answers nothing where the schema states none or not a string", () => {
    expect(titleOf({ title: "Full name" })).toBe("Full name");
    expect(titleOf({})).toBeUndefined();
    expect(titleOf({ title: 3 })).toBeUndefined();
  });
});

describe("choicesOf", () => {
  it("reads the string choices of an enum and none where the schema lists none", () => {
    expect(choicesOf({ enum: ["a", 3, "b"] })).toStrictEqual(["a", "b"]);
    expect(choicesOf({})).toStrictEqual([]);
  });
});
