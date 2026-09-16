/**
 * Pins the public surface, so an export cannot appear or disappear unnoticed.
 */

import { describe, expect, it } from "vitest";

import * as published from "#index.ts";

/**
 * Names every export the package publishes, in no particular order.
 */
const SURFACE = ["layers", "rules", "warn", "workspace"];

describe("vite-config-css", () => {
  it("publishes what a repository with stylesheets needs", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(SURFACE.toSorted());
  });
});
