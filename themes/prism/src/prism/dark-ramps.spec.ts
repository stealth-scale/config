import { describe, expect, it } from "vitest";

import { darkRamps } from "#prism/dark-ramps.ts";

describe("darkRamps", () => {
  it("keys every ramp by its own steps", () => {
    expect(Object.keys(darkRamps.blue)).toStrictEqual([
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
    expect(darkRamps.blue["100"]).toStrictEqual({ value: "oklch(22.5% 0.0772 269.6)" });
  });

  it("draws a ramp for 11 hues", () => {
    expect(Object.keys(darkRamps)).toHaveLength(11);
  });
});
