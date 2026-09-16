/**
 * Specifies that a rule is named once and reaches the tiers it belongs to.
 */

import { describe, expect, it } from "vitest";

import { base, MARKUP, node, SAFETY, SIZE, STYLE, web } from "#lint/rules/index.ts";

const SHARED = { SAFETY, SIZE, STYLE };

describe("vite-config", () => {
  it("names every rule once", () => {
    const seen = new Map<string, string>();

    for (const [domain, held] of Object.entries({ ...SHARED, MARKUP })) {
      for (const rule of Object.keys(held)) {
        expect(seen.has(rule), `${rule} is in both ${String(seen.get(rule))} and ${domain}`).toBe(
          false,
        );

        seen.set(rule, domain);
      }
    }
  });

  it("gathers every shared domain", () => {
    const gathered = Object.keys(base());

    for (const held of Object.values(SHARED)) {
      expect(gathered).toStrictEqual(expect.arrayContaining(Object.keys(held)));
    }
  });

  it("applies the markup rules to a package the browser runs", () => {
    expect(Object.keys(web())).toStrictEqual(expect.arrayContaining(Object.keys(MARKUP)));
  });

  it("applies no markup rule to a package the console runs", () => {
    for (const rule of Object.keys(MARKUP)) {
      expect(Object.keys(node())).not.toContain(rule);
    }
  });

  it("applies every shared rule to both", () => {
    for (const held of [node(), web()]) {
      expect(Object.keys(held)).toStrictEqual(expect.arrayContaining(Object.keys(base())));
    }
  });
});
