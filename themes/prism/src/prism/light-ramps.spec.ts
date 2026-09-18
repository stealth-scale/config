import { describe, expect, it } from "vitest";

import { lightRamps } from "#prism/light-ramps.ts";

describe("lightRamps", () => {
  it("keys every ramp by its own steps", () => {
    expect(Object.keys(lightRamps.blue)).toStrictEqual([
      "100",
      "200",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "900",
      "1000",
      "1100",
      "1200",
      "1300",
      "1400",
      "1500",
      "1600",
    ]);
  });

  it("draws blue at its first step", () => {
    expect(lightRamps.blue["100"]).toStrictEqual({ value: "oklch(98.1% 0.0091 258.3)" });
  });

  it("draws a ramp for 11 hues", () => {
    expect(Object.keys(lightRamps)).toHaveLength(11);
  });
});
