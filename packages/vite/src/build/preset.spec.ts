import { expect, test } from "vite-plus/test";

import { base, web } from "#build/preset.ts";

test("emits hidden maps in every tier, output nobody can read being worth mapping anywhere", () => {
  for (const tier of [base(), web()]) {
    expect(tier.map((one) => one.name)).toContain("build.sourcemaps");
  }
});

test("says nothing about a page in the tier that says nothing about where it runs", () => {
  const held = base()
    .map((one) => one.name)
    .join();

  expect(held).not.toContain("manifest");
  expect(held).not.toContain("preload");
});

test("writes a manifest and drops the polyfill where there is a page", () => {
  const held = web().map((one) => one.name);

  expect(held).toContain("build.manifest");
  expect(held).toContain("build.preload");
});

test("says what it is made of and who to credit for it, wherever it is deployed", () => {
  const held = web().map((one) => one.name);

  expect(held).toContain("build.inventory");
  expect(held).toContain("build.licences");
});
