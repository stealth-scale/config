import { describe, expect, it } from "vitest";

import { darkRamps } from "#graphite/dark-ramps.ts";

describe("darkRamps", () => {
  it("keys every ramp by its own steps", () => {
    expect(Object.keys(darkRamps.blue)).toStrictEqual([
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "tint",
    ]);
  });

  it("draws blue at its first step", () => {
    expect(darkRamps.blue["0"]).toStrictEqual({ value: "oklch(91.6% 0.0447 241.1)" });
  });

  it("draws a ramp for 8 hues", () => {
    expect(Object.keys(darkRamps)).toHaveLength(8);
  });
});
