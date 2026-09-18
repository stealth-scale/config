import { describe, expect, it } from "vitest";

import { darkRamps } from "#compass/dark-ramps.ts";

describe("darkRamps", () => {
  it("keys every ramp by its own steps", () => {
    expect(Object.keys(darkRamps.blue)).toStrictEqual([
      "100",
      "200",
      "250",
      "300",
      "400",
      "500",
      "600",
      "700",
      "800",
      "850",
      "900",
      "1000",
    ]);
  });

  it("draws blue at its first step", () => {
    expect(darkRamps.blue["100"]).toStrictEqual({ value: "oklch(95.8% 0.0188 255.5)" });
  });

  it("draws a ramp for 9 hues", () => {
    expect(Object.keys(darkRamps)).toHaveLength(9);
  });
});
