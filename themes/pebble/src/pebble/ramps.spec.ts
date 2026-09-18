import { describe, expect, it } from "vitest";

import { ramps } from "#pebble/ramps.ts";

describe("ramps", () => {
  it("keys every ramp by its own steps", () => {
    expect(Object.keys(ramps.blue)).toStrictEqual([
      "50",
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "950",
    ]);
  });

  it("draws blue at its first step", () => {
    expect(ramps.blue["50"]).toStrictEqual({ value: "oklch(97.0% 0.0140 254.6)" });
  });

  it("draws a ramp for 11 hues", () => {
    expect(Object.keys(ramps)).toHaveLength(11);
  });
});
