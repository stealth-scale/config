import { describe, expect, it } from "vitest";

import { darkRamps } from "#asphalt/dark-ramps.ts";

describe("darkRamps", () => {
  it("keys every ramp by its own steps", () => {
    expect(Object.keys(darkRamps.blue)).toStrictEqual([
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
    expect(darkRamps.blue["50"]).toStrictEqual({ value: "oklch(19.9% 0.0612 262.2)" });
  });

  it("draws a ramp for 10 hues", () => {
    expect(Object.keys(darkRamps)).toHaveLength(10);
  });
});
