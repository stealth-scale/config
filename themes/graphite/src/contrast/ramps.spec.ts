import { describe, expect, it } from "vitest";

import { ramps } from "#contrast/ramps.ts";

describe("ramps", () => {
  it("redraws blue at its first step", () => {
    expect(ramps.blue).toHaveProperty(["dark", "0", "value"], "oklch(92.1% 0.0442 236.7)");
  });

  it("redraws a ramp for 8 hues", () => {
    expect(Object.keys(ramps)).toHaveLength(8);
  });
});
