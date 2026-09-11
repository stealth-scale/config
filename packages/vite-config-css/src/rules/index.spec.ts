import { expect, test } from "vite-plus/test";

import { all, ANIMATION, CASCADE, ORDER, SELECTOR } from "#rules/index.ts";

/**
 * The rules Google asks for that the shared set already states.
 */
const SHARED = [
  "selector-class-pattern",
  "length-zero-no-unit",
  "color-hex-length",
  "shorthand-property-no-redundant-values",
  "declaration-block-no-redundant-longhand-properties",
];

/**
 * Reads the shared set this package builds on.
 *
 * @returns Every rule it states.
 */
async function standard(): Promise<Record<string, unknown>> {
  const held = await import("stylelint-config-standard");

  return held.default.rules;
}

test("gathers every domain beside it, so adding one is not also a thing to remember", () => {
  expect(Object.keys(all()).toSorted()).toEqual(
    [
      ...Object.keys(SELECTOR),
      ...Object.keys(CASCADE),
      ...Object.keys(ORDER),
      ...Object.keys(ANIMATION),
    ].toSorted(),
  );
});

test("states nothing the shared set already states", async () => {
  const held = await standard();

  for (const name of Object.keys(all())) {
    expect(Object.keys(held), `${name} is already in the shared set`).not.toContain(name);
  }
});

test("leans on the shared set for the rest of the guide rather than restating it", async () => {
  const held = await standard();

  for (const name of SHARED) {
    expect(Object.keys(held), `${name} is no longer in the shared set`).toContain(name);
  }
});
