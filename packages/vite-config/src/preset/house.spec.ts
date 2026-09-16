/**
 * Proves the house layers reach every tier and decide nothing a tier should.
 */

import { describe, expect, it } from "vitest";

import { layers as app } from "#preset/app.ts";
import { layers as base } from "#preset/base.ts";
import { house } from "#preset/house.ts";
import { layers as node } from "#preset/node.ts";
import { layers as web } from "#preset/web.ts";

/**
 * Flattens a nested layer list to whatever depth it reaches and lists what each
 * is called.
 */
function names(of: readonly unknown[]): string[] {
  return of.flatMap((held) =>
    Array.isArray(held) ? names(held) : [(held as { name: string }).name],
  );
}

describe("house", () => {
  it("declares how a file is formatted", () => {
    const held = names(house());

    expect(held.some((one) => one.startsWith("fmt."))).toBe(true);
  });

  it("resolves a workspace package to its own source", () => {
    expect(names(house()).some((one) => one.startsWith("resolve."))).toBe(true);
  });

  it("decides nothing about what a package is or where it runs", () => {
    const held = names(house()).join();

    expect(held).not.toContain("pack.");
    expect(held).not.toContain("build.");
    expect(held).not.toContain("lint.preset");
    expect(held).not.toContain("test.environment");
  });

  it("applies in every tier", () => {
    for (const tier of [base(), node(), web(), app()]) {
      expect(names(tier)).toStrictEqual(expect.arrayContaining(names(house())));
    }
  });
});
