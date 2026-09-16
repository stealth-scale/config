/**
 * Checks what the runner demands of a test before it counts as passing.
 */

import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { assertion } from "#test/assertion.ts";

/**
 * Reaches the runner block the layer states.
 */
function block(): NonNullable<UserConfig["test"]> {
  return (assertion().config as UserConfig).test as NonNullable<UserConfig["test"]>;
}

describe("assertion", () => {
  it("refuses a test that asserts nothing", () => {
    expect(block().expect?.requireAssertions).toBe(true);
  });

  it("keeps the runner API imported rather than ambient", () => {
    expect(block().globals).toBe(false);
  });

  it("shows a whole snapshot diff rather than a patch around the change", () => {
    expect(block().expandSnapshotDiff).toBe(true);
  });
});
