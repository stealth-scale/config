import { describe, expect, it } from "vitest";

import { lightRamps } from "#graphite/light-ramps.ts";

describe("lightRamps", () => {
  it("keys every ramp by its own steps", () => {
    expect(Object.keys(lightRamps.blue)).toStrictEqual([
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
    ]);
  });

  it("draws blue at its first step", () => {
    expect(lightRamps.blue["0"]).toStrictEqual({ value: "oklch(95.4% 0.0284 228.0)" });
  });

  it("draws a ramp for 8 hues", () => {
    expect(Object.keys(lightRamps)).toHaveLength(8);
  });
});
