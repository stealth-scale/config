import { describe, expect, it } from "vitest";

import { lightRamps } from "#lantern/light-ramps.ts";

describe("lightRamps", () => {
  it("keys every ramp by its own steps", () => {
    expect(Object.keys(lightRamps.blue)).toStrictEqual([
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
    expect(lightRamps.blue["1"]).toStrictEqual({ value: "oklch(96.0% 0.0210 241.3)" });
  });

  it("draws a ramp for 10 hues", () => {
    expect(Object.keys(lightRamps)).toHaveLength(10);
  });
});
