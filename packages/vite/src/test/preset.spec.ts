import { expect, test } from "vite-plus/test";

import { base, node, web } from "#test/preset.ts";

test("says nothing about where a package runs, in the tier that says nothing about it", () => {
  expect(
    base()
      .map((one) => one.name)
      .join(),
  ).not.toContain("environment");
});

test("runs a console package's tests in the runner's own environment", () => {
  expect(node().map((one) => one.name)).toContain("test.environment(node)");
});

test("gives a browser package a document to render into", () => {
  expect(web().map((one) => one.name)).toContain("test.environment(happy-dom)");
});

test("holds every tier to the same isolation, coverage and file spelling", () => {
  for (const tier of [base(), node(), web()]) {
    const held = tier.map((one) => one.name);

    expect(held).toContain("test.isolation");
    expect(held).toContain("test.coverage");
    expect(held).toContain("test.files");
    expect(held).toContain("test.assertion");
    expect(held).toContain("test.order");
  }
});
