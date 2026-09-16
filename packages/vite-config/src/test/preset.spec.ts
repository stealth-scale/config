import { describe, expect, it } from "vitest";

import { base, node, web } from "#test/preset.ts";

describe("preset", () => {
  it("declares no platform in the tier that is agnostic about it", () => {
    expect(
      base()
        .map((one) => one.name)
        .join(),
    ).not.toContain("environment");
  });

  it("runs a console package's tests in the runner's own environment", () => {
    expect(node().map((one) => one.name)).toContain("test.environment(node)");
  });

  it("gives a browser package a document to render into", () => {
    expect(web().map((one) => one.name)).toContain("test.environment(happy-dom)");
  });

  it("holds every tier to the same isolation coverage and file naming", () => {
    for (const tier of [base(), node(), web()]) {
      const held = tier.map((one) => one.name);

      expect(held).toContain("test.isolation");
      expect(held).toContain("test.coverage");
      expect(held).toContain("test.files");
      expect(held).toContain("test.assertion");
      expect(held).toContain("test.order");
    }
  });
});
