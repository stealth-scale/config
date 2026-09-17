import { describe, expect, it } from "vitest";

import { durations } from "#preset/tokens/durations.ts";
import { tokenAt } from "#tokens.fixtures.ts";

function millisOf(name: string): number {
  const value = String(tokenAt(durations, name));

  return value.endsWith("ms") ? Number(value.slice(0, -2)) : Number(value.slice(0, -1)) * 1000;
}

describe("durations", () => {
  it("runs every answer to a press under half a second", () => {
    for (const name of ["fastest", "faster", "fast", "moderate", "slow", "slower", "slowest"]) {
      expect(millisOf(name)).toBeLessThanOrEqual(500);
    }
  });

  it("runs the ambient loops over a second and each slower than the last", () => {
    expect(millisOf("ambient")).toBeGreaterThan(1000);
    expect(millisOf("ambientSlow")).toBeGreaterThan(millisOf("ambient"));
    expect(millisOf("ambientSlower")).toBeGreaterThan(millisOf("ambientSlow"));
  });

  it("names no time at all", () => {
    expect(tokenAt(durations, "none")).toBe("0s");
  });
});
