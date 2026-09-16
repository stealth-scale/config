import { describe, expect, it } from "vitest";

import { radii, shadows } from "#scales/depth.ts";
import { modedAt, tokenAt } from "#tokens.fixtures.ts";

describe("depth", () => {
  it("draws three corners", () => {
    expect(Object.keys(radii("1rem"))).toStrictEqual(["l1", "l2", "l3"]);
  });

  it("gives the outermost corner the radius it was asked for", () => {
    expect(tokenAt(radii("1rem"), "l3")).toBe("1rem");
  });

  it("keeps a nested corner concentric by taking a share of the outermost", () => {
    expect(tokenAt(radii("1rem"), "l1")).toBe("calc(1rem * 0.5)");
    expect(tokenAt(radii("1rem"), "l2")).toBe("calc(1rem * 0.75)");
  });

  it("draws the corners from whatever unit the theme stated", () => {
    expect(tokenAt(radii("2px"), "l1")).toBe("calc(2px * 0.5)");
  });

  it("draws six heights and the two inner shadows", () => {
    expect(Object.keys(shadows(262))).toStrictEqual([
      "xs",
      "sm",
      "md",
      "lg",
      "xl",
      "2xl",
      "inner",
      "inset",
    ]);
  });

  it("casts further at each height", () => {
    expect(modedAt(shadows(262), "xs", "base")).toContain("0 1px 2px");
    expect(modedAt(shadows(262), "2xl", "base")).toContain("0 24px 48px");
  });

  it("tints the shadow with the hue it was given", () => {
    expect(modedAt(shadows(120), "md", "base")).toContain("120");
  });

  it("casts a black shadow three times as dark on a dark page", () => {
    expect(modedAt(shadows(262), "md", "_dark")).toContain("oklch(0% 0.02 262 / 0.240)");
    expect(modedAt(shadows(262), "md", "base")).toContain("oklch(20% 0.02 262 / 0.080)");
  });

  it("scales every alpha by the depth a theme asked for", () => {
    expect(modedAt(shadows(262, 2), "md", "base")).toContain("0.160");
  });

  it("draws the inner shadows inset", () => {
    expect(modedAt(shadows(262), "inner", "base")).toMatch(/^inset 0 2px 4px 0 /u);
    expect(modedAt(shadows(262), "inset", "base")).toMatch(/^inset 0 0 0 1px /u);
  });
});
