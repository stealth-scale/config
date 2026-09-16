import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { files } from "#test/files.ts";

/**
 * Reads the test block the preset sets.
 *
 * @returns That block.
 */
function block(): NonNullable<UserConfig["test"]> {
  return (files().config as UserConfig).test as NonNullable<UserConfig["test"]>;
}

describe("files", () => {
  it("reads one spelling of a test file rather than the runner's two", () => {
    expect(block().include).toStrictEqual(["**/*.spec.{ts,tsx}"]);
    expect(JSON.stringify(block().include)).not.toContain("test.");
  });

  it("ignores a built file whose tests would be counted twice", () => {
    expect(block().exclude).toContain("**/dist/**");
  });

  it("keeps what the runner already ignores", () => {
    expect(block().exclude).toContain("**/node_modules/**");
    expect(block().exclude).toContain("**/.git/**");
  });
});
