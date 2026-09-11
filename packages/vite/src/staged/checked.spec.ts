import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { checked } from "#staged/checked.ts";

/**
 * Reads back the staged rules the layer states.
 *
 * @returns Each glob against what runs on it.
 */
function staged(): Record<string, unknown> {
  return (checked().config as UserConfig).staged as Record<string, unknown>;
}

test("runs the same command a repository runs by hand, over the files that changed", () => {
  expect(Object.values(staged())).toEqual(["vp check --fix"]);
});

test("fixes what it can, so the diff under review is the one the tools agree on", () => {
  expect(Object.values(staged()).join()).toContain("--fix");
});

test("matches source and nothing else, the rest having no lint or types to check", () => {
  const [glob] = Object.keys(staged());

  expect(glob).toContain("ts,tsx");
  expect(glob).not.toContain("md");
});

test("names itself, so a repository checking differently can take the layer back", () => {
  expect(checked().name).toBe("staged.checked");
});
