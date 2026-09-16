/**
 * Proves the staged check matches source alone and fixes what it can.
 */

import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { checked } from "#staged/checked.ts";

/**
 * Reads the glob table out of a freshly built layer.
 */
function staged(): Record<string, unknown> {
  return (checked().config as UserConfig).staged as Record<string, unknown>;
}

describe("checked", () => {
  it("runs the same command a repository runs by hand over the changed files", () => {
    expect(Object.values(staged())).toStrictEqual(["vp check --fix"]);
  });

  it("fixes what it can", () => {
    expect(Object.values(staged()).join()).toContain("--fix");
  });

  it("matches source and nothing else", () => {
    const [glob] = Object.keys(staged());

    expect(glob).toContain("ts,tsx");
    expect(glob).not.toContain("md");
  });

  it("names the layer so a repository can remove it", () => {
    expect(checked().name).toBe("staged.checked");
  });
});
