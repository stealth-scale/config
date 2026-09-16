/**
 * Covers the package call, which is expected to contribute nothing.
 */

import { describe, expect, it } from "vitest";

import { layers } from "#layers.ts";

describe("layers", () => {
  it("contributes nothing to a component package or a theme package", () => {
    expect(layers()).toStrictEqual([]);
  });
});
