import { expect, test } from "vite-plus/test";

import { base, node, web } from "#pack/preset.ts";

test("says nothing about where a package runs, in the tier that says nothing about it", () => {
  expect(
    base()
      .map((one) => one.name)
      .join(),
  ).not.toContain("platform");
});

test("leaves a console package on the packer's own target, which is already node", () => {
  expect(node().map((one) => one.name)).toEqual(base().map((one) => one.name));
});

test("builds a library for no runtime in particular, one being imported in both", () => {
  expect(web().map((one) => one.name)).toContain("pack.platform(neutral)");
});

test("ships types, checks the manifest and resolves to source in every tier", () => {
  for (const tier of [base(), node(), web()]) {
    const held = tier.map((one) => one.name);

    expect(held).toContain("pack.carry");
    expect(held).toContain("pack.declarations");
    expect(held).toContain("pack.quality");
    expect(held.some((one) => one.startsWith("pack.source("))).toBe(true);
  }
});
