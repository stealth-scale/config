import { describe, expect, it } from "vitest";

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

describe("vite-config-css", () => {
  it("gathers every rule domain beside it", () => {
    expect(Object.keys(all()).toSorted()).toStrictEqual(
      [
        ...Object.keys(SELECTOR),
        ...Object.keys(CASCADE),
        ...Object.keys(ORDER),
        ...Object.keys(ANIMATION),
      ].toSorted(),
    );
  });

  it("declares nothing the shared set already declares", async () => {
    const held = await standard();

    for (const name of Object.keys(all())) {
      expect(Object.keys(held), `${name} is already in the shared set`).not.toContain(name);
    }
  });

  it("defers to the shared set for the rest of the guide", async () => {
    const held = await standard();

    for (const name of SHARED) {
      expect(Object.keys(held), `${name} is no longer in the shared set`).toContain(name);
    }
  });
});
