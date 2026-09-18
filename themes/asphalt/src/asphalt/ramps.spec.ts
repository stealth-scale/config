import { describe, expect, it } from "vitest";

import { ramps } from "#asphalt/ramps.ts";

describe("ramps", () => {
  it("nests the dark ramp under the light one", () => {
    expect(ramps.blue).toHaveProperty("dark");
    expect(ramps.blue).toHaveProperty("50");
  });

  it("nests a dark ramp for every hue", () => {
    expect(Object.values(ramps).every((hue) => "dark" in hue)).toBe(true);
  });
});
