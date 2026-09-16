/**
 * Guards the one rule that keeps an animation off the main thread.
 */

import { describe, expect, it } from "vitest";

import { ANIMATION } from "#rules/animation.ts";

describe("animation", () => {
  it("rejects an animation the browser cannot run on the compositor", () => {
    expect(ANIMATION["plugin/no-low-performance-animation-properties"]).toBe(true);
  });
});
