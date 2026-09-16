/**
 * Pins the public surface, so an export cannot appear or disappear unnoticed.
 */

import { describe, expect, it } from "vitest";

import * as published from "#index.ts";

/**
 * Names every export the package publishes, in no particular order.
 */
const SURFACE = ["layers", "runtime", "stylesheet", "workspace"];

describe("vite-config-theme", () => {
  it("publishes what a repository with a design system needs", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(SURFACE.toSorted());
  });
});
