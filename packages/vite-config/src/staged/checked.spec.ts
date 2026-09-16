import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { checked } from "#staged/checked.ts";

/**
 * Reads back the staged rules the layer states.
 *
 * @returns Each glob against what runs on it.
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
