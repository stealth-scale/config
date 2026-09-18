import { describe, expect, it } from "vitest";

import { darkRamps } from "#dimmed/dark-ramps.ts";

describe("darkRamps", () => {
  it("redraws blue at its first step", () => {
    expect(darkRamps.blue).toHaveProperty(["dark", "0", "value"], "oklch(91.0% 0.0481 241.6)");
  });

  it("redraws a ramp for 8 hues", () => {
    expect(Object.keys(darkRamps)).toHaveLength(8);
  });
});
