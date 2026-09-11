import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { isolation } from "#test/isolation.ts";

/**
 * Reads the test block the preset sets.
 *
 * @returns That block.
 */
function block(): NonNullable<UserConfig["test"]> {
  return (isolation().config as UserConfig).test as NonNullable<UserConfig["test"]>;
}

test("forgets a mock's calls and puts its implementation back", () => {
  expect(block().clearMocks).toBe(true);
  expect(block().restoreMocks).toBe(true);
});

test("puts back an environment variable and a global a test replaced", () => {
  expect(block().unstubEnvs).toBe(true);
  expect(block().unstubGlobals).toBe(true);
});

test("states all four, since the runner leaves every one of them off", () => {
  expect(Object.keys(block()).toSorted()).toEqual([
    "clearMocks",
    "restoreMocks",
    "unstubEnvs",
    "unstubGlobals",
  ]);
});

test("leaves leak detection alone, which reports nothing anybody can act on", () => {
  expect(block().detectAsyncLeaks).toBeUndefined();
});
