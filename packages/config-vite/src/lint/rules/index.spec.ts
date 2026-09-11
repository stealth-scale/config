import { expect, test } from "vite-plus/test";

import { base, MARKUP, node, SAFETY, SIZE, STYLE, web } from "#lint/rules/index.ts";

/**
 * The domains every package is held to, against the name each is written under.
 */
const SHARED = { SAFETY, SIZE, STYLE };

test("names every rule once, so no domain silently wins over another", () => {
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

test("gathers every shared domain, so a rule written in one is one a package is held to", () => {
  const gathered = Object.keys(base());

  for (const held of Object.values(SHARED)) {
    expect(gathered).toEqual(expect.arrayContaining(Object.keys(held)));
  }
});

test("holds a package the browser runs to what only means anything against a document", () => {
  expect(Object.keys(web())).toEqual(expect.arrayContaining(Object.keys(MARKUP)));
});

test("holds a package the console runs to none of it", () => {
  for (const rule of Object.keys(MARKUP)) {
    expect(Object.keys(node())).not.toContain(rule);
  }
});

test("holds both to everything shared, so an environment adds rather than replaces", () => {
  for (const held of [node(), web()]) {
    expect(Object.keys(held)).toEqual(expect.arrayContaining(Object.keys(base())));
  }
});
