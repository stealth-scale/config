import { describe, expect, it } from "vitest";

import { utilities } from "#preset/utilities.ts";

describe("utilities", () => {
  it("adds to the compiler's utilities rather than replacing them", () => {
    expect(Object.keys(utilities)).toStrictEqual(["extend"]);
  });

  it("gives the underline offset three steps in em", () => {
    expect(utilities.extend?.["textUnderlineOffset"]).toStrictEqual({
      className: "tu-o",
      group: "Typography",
      values: { loose: "0.3em", normal: "0.2em", tight: "0.1em" },
    });
  });
});
