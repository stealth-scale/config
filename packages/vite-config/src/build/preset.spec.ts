import { describe, expect, it } from "vitest";

import { base, web } from "#build/preset.ts";

describe("preset", () => {
  it("emits hidden maps in every tier", () => {
    for (const tier of [base(), web()]) {
      expect(tier.map((one) => one.name)).toContain("build.sourcemaps");
    }
  });

  it("configures no page in the tier that is agnostic about where it runs", () => {
    const held = base()
      .map((one) => one.name)
      .join();

    expect(held).not.toContain("manifest");
    expect(held).not.toContain("preload");
    expect(held).not.toContain("chunks");
  });

  it("writes a manifest and drops the polyfill where there is a page", () => {
    const held = web().map((one) => one.name);

    expect(held).toContain("build.manifest");
    expect(held).toContain("build.preload");
    expect(held).toContain("build.chunks");
  });

  it("records who to credit for what the bundle is made of", () => {
    expect(web().map((one) => one.name)).toContain("build.licences");
  });
});
