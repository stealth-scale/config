import { describe, expect, it } from "vitest";

import { darkRamps } from "#lantern/dark-ramps.ts";

describe("darkRamps", () => {
  it("keys every ramp by its own steps", () => {
    expect(Object.keys(darkRamps.blue)).toStrictEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
    ]);
  });

  it("draws blue at its first step", () => {
    expect(darkRamps.blue["1"]).toStrictEqual({ value: "oklch(21.9% 0.0380 263.3)" });
  });

  it("draws a ramp for 10 hues", () => {
    expect(Object.keys(darkRamps)).toHaveLength(10);
  });
});
