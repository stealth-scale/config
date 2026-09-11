import { expect, test } from "vite-plus/test";

import { layers as app } from "#preset/app.ts";
import { layers as base } from "#preset/base.ts";
import { house } from "#preset/house.ts";
import { layers as node } from "#preset/node.ts";
import { layers as web } from "#preset/web.ts";

/**
 * Names every layer a tier is built on, however deeply the tier nested them.
 *
 * @param of - The tier's layers.
 * @returns Every name in it.
 */
function names(of: readonly unknown[]): string[] {
  return of.flatMap((held) =>
    Array.isArray(held) ? names(held) : [(held as { name: string }).name],
  );
}

test("states how a file is formatted, which no tier decides", () => {
  const held = names(house());

  expect(held.some((one) => one.startsWith("fmt."))).toBe(true);
});

test("resolves a workspace package to its own source, which no tier decides either", () => {
  expect(names(house()).some((one) => one.startsWith("resolve."))).toBe(true);
});

test("decides nothing about what a package is or where it runs", () => {
  const held = names(house()).join();

  expect(held).not.toContain("pack.");
  expect(held).not.toContain("build.");
  expect(held).not.toContain("lint.preset");
  expect(held).not.toContain("test.environment");
});

test("is in every tier, so adding one cannot quietly leave the shared answers out", () => {
  for (const tier of [base(), node(), web(), app()]) {
    expect(names(tier)).toEqual(expect.arrayContaining(names(house())));
  }
});
