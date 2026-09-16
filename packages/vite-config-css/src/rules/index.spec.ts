/**
 * Holds the boundary between what this package declares and what the shared
 * guide already covers.
 */

import { describe, expect, it } from "vitest";

import { all, ANIMATION, CASCADE, ORDER, SELECTOR } from "#rules/index.ts";

/**
 * Names rules this package deliberately leaves to the shared guide.
 *
 * @remarks
 *   A name dropped from the shared guide upstream is a rule nobody enforces
 *   any more, which a test reading the guide catches and a test reading only
 *   this package's sets never would.
 */
const SHARED = [
  "selector-class-pattern",
  "length-zero-no-unit",
  "color-hex-length",
  "shorthand-property-no-redundant-values",
  "declaration-block-no-redundant-longhand-properties",
];

/**
 * Loads the rules the installed copy of the shared guide turns on.
 *
 * @remarks
 *   The guide is read from the version this repository has installed rather
 *   than from a list written down here, so an upgrade that moves a rule shows
 *   up as a failing test.
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
