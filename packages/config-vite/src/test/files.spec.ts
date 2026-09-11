import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { files } from "#test/files.ts";

/**
 * Reads the test block the preset sets.
 *
 * @returns That block.
 */
function block(): NonNullable<UserConfig["test"]> {
  return (files().config as UserConfig).test as NonNullable<UserConfig["test"]>;
}

test("reads one spelling of a test file rather than the runner's two", () => {
  expect(block().include).toEqual(["**/*.spec.{ts,tsx}"]);
  expect(JSON.stringify(block().include)).not.toContain("test.");
});

test("walks past a built file, whose tests would be counted twice", () => {
  expect(block().exclude).toContain("**/dist/**");
});

test("keeps what the runner already walked past, since naming the key replaces the list", () => {
  expect(block().exclude).toContain("**/node_modules/**");
  expect(block().exclude).toContain("**/.git/**");
});
