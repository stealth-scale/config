import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { assertion } from "#test/assertion.ts";

/**
 * Reads the test block the preset sets.
 *
 * @returns That block.
 */
function block(): NonNullable<UserConfig["test"]> {
  return (assertion().config as UserConfig).test as NonNullable<UserConfig["test"]>;
}

test("refuses a test that asserts nothing, which passes whether the code works or not", () => {
  expect(block().expect?.requireAssertions).toBe(true);
});

test("keeps the runner's api imported rather than ambient", () => {
  expect(block().globals).toBe(false);
});

test("shows a whole snapshot diff rather than a patch around the change", () => {
  expect(block().expandSnapshotDiff).toBe(true);
});
