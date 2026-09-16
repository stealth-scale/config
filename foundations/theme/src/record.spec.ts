import { describe, expect, it } from "vitest";

import { recordOf } from "#record.ts";

describe("recordOf", () => {
  it("builds one entry per key in the order the keys are listed", () => {
    expect(Object.keys(recordOf(["b", "a"], (key) => key))).toStrictEqual(["b", "a"]);
  });

  it("fills each entry from its key", () => {
    expect(recordOf(["x", "y"], (key) => key.toUpperCase())).toStrictEqual({ x: "X", y: "Y" });
  });

  it("returns an empty record when the list is empty", () => {
    expect(recordOf([], () => 1)).toStrictEqual({});
  });
});
