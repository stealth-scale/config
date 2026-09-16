import { describe, expect, it } from "vitest";

import { base, node, web } from "#pack/preset.ts";

describe("preset", () => {
  it("declares no platform in the tier that is agnostic about it", () => {
    expect(
      base()
        .map((one) => one.name)
        .join(),
    ).not.toContain("platform");
  });

  it("leaves a console package on the packer's own target", () => {
    expect(node().map((one) => one.name)).toStrictEqual(base().map((one) => one.name));
  });

  it("builds a library for no runtime in particular", () => {
    expect(web().map((one) => one.name)).toContain("pack.platform(neutral)");
  });

  it("ships types and checks the manifest in every tier", () => {
    for (const tier of [base(), node(), web()]) {
      const held = tier.map((one) => one.name);

      expect(held).toContain("pack.carry");
      expect(held).toContain("pack.declarations");
      expect(held).toContain("pack.quality");
      expect(held.some((one) => one.startsWith("pack.source("))).toBe(true);
    }
  });
});
