/**
 * Checks what is put back between one test and the next.
 */

import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { isolation } from "#test/isolation.ts";

/**
 * Returns the runner block the layer states, and nothing around it.
 */
function block(): NonNullable<UserConfig["test"]> {
  return (isolation().config as UserConfig).test as NonNullable<UserConfig["test"]>;
}

describe("isolation", () => {
  it("resets a mock's calls and restores its implementation", () => {
    expect(block().clearMocks).toBe(true);
    expect(block().restoreMocks).toBe(true);
  });

  it("restores an environment variable and a global a test replaced", () => {
    expect(block().unstubEnvs).toBe(true);
    expect(block().unstubGlobals).toBe(true);
  });

  it("sets all four", () => {
    expect(Object.keys(block()).toSorted()).toStrictEqual([
      "clearMocks",
      "restoreMocks",
      "unstubEnvs",
      "unstubGlobals",
    ]);
  });

  it("leaves leak detection alone", () => {
    expect(block().detectAsyncLeaks).toBeUndefined();
  });
});
