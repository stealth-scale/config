import { describe, expect, it } from "vitest";

import { ramps } from "#quartz/ramps.ts";

describe("ramps", () => {
  it("keys every ramp by its own steps", () => {
    expect(Object.keys(ramps.blue)).toStrictEqual([
      "10",
      "20",
      "30",
      "40",
      "50",
      "60",
      "70",
      "80",
      "90",
      "100",
      "110",
      "120",
      "130",
      "140",
      "150",
      "160",
    ]);
  });

  it("draws blue at its first step", () => {
    expect(ramps.blue["160"]).toStrictEqual({ value: "oklch(96.1% 0.0148 251.2)" });
  });

  it("draws a ramp for 10 hues", () => {
    expect(Object.keys(ramps)).toHaveLength(10);
  });
});
