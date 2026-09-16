import { describe, expect, it } from "vitest";

import { radii } from "#preset/tokens/radii.ts";
import { tokenAt } from "#tokens.fixtures.ts";

describe("radii", () => {
  it("runs from a square corner to a pill", () => {
    expect(tokenAt(radii, "none")).toBe("0");
    expect(tokenAt(radii, "full")).toBe("9999px");
  });

  it("lists nine steps between them in rem", () => {
    const steps = Object.keys(radii).filter((name) => name !== "none" && name !== "full");

    expect(steps).toHaveLength(9);
    expect(steps.every((name) => String(tokenAt(radii, name)).endsWith("rem"))).toBe(true);
  });
});
