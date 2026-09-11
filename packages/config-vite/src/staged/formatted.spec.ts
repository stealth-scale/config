import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { formatted } from "#staged/formatted.ts";

/**
 * Reads back the staged rules the layer states.
 *
 * @returns Each glob against what runs on it.
 */
function staged(): Record<string, unknown> {
  return (formatted().config as UserConfig).staged as Record<string, unknown>;
}

test("formats and does no more, there being no lint or types in a stylesheet", () => {
  expect(Object.values(staged())).toEqual(["vp fmt"]);
});

test("matches what the formatter reads and the linter does not", () => {
  const [glob] = Object.keys(staged());

  expect(glob).toContain("md");
  expect(glob).toContain("css");
  expect(glob).not.toContain("tsx");
});

test("names itself, so a repository formatting differently can take the layer back", () => {
  expect(formatted().name).toBe("staged.formatted");
});
