/**
 * Checks that the test files are shuffled rather than run in a fixed order.
 */

import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { order } from "#test/order.ts";

describe("order", () => {
  it("runs in a different order every time", () => {
    const held = (order().config as UserConfig).test?.sequence;

    expect(held?.shuffle).toBe(true);
  });
});
