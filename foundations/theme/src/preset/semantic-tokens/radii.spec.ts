import { describe, expect, it } from "vitest";

import { radii } from "#preset/semantic-tokens/radii.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("radii", () => {
  it("draws three concentric corners from ten sixteenths of a rem", () => {
    expect(tokenAt(radii, "l3")).toBe("0.625rem");
    expect(tokenAt(radii, "l1")).toBe("calc(0.625rem * 0.5)");
  });
});
