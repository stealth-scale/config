import { describe, expect, it } from "vitest";

import { lightRamps } from "#asphalt/light-ramps.ts";

describe("lightRamps", () => {
  it("keys every ramp by its own steps", () => {
    expect(Object.keys(lightRamps.blue)).toStrictEqual([
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
    ]);
  });

  it("draws blue at its first step", () => {
    expect(lightRamps.blue["50"]).toStrictEqual({ value: "oklch(96.6% 0.0144 264.5)" });
  });

  it("draws a ramp for 10 hues", () => {
    expect(Object.keys(lightRamps)).toHaveLength(10);
  });
});
