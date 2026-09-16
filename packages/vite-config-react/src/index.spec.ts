/**
 * Pins the surface this package publishes, so a block cannot be added without a decision.
 */

import { describe, expect, it } from "vitest";

import * as published from "#index.ts";

const SURFACE = ["federation", "fmt", "layers", "lint", "plugin", "test", "workspace"];

describe("vite-config-react", () => {
  it("publishes what a repository that renders needs", () => {
    expect(Object.keys(published).toSorted()).toStrictEqual(SURFACE.toSorted());
  });
});
