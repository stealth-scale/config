import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { ci } from "#run/ci.ts";

/**
 * Reads back the task the layer states.
 *
 * @returns The `ci` task.
 */
function proving(): { cache: false; command: string[] } {
  return (ci().config as UserConfig).run?.tasks?.["ci"] as { cache: false; command: string[] };
}

test("builds before it checks, everything after the build reading what it wrote", () => {
  const held = proving().command;

  expect(held.indexOf("vp run -r build")).toBeLessThan(held.indexOf("vp check"));
});

test("checks before it tests, the checks being the cheaper of the two", () => {
  const held = proving().command;

  expect(held.indexOf("vp check")).toBeLessThan(held.indexOf("vp test --run"));
});

test("runs the tests once rather than watching, nothing being there to watch", () => {
  expect(proving().command).toContain("vp test --run");
});

test("is never cached, a cached proof of the tree proving a different tree", () => {
  expect(proving().cache).toBe(false);
});

test("installs nothing, the package manager being the repository's choice", () => {
  expect(proving().command.join(" ")).not.toMatch(/install|audit/u);
});

test("names itself, so a repository proving itself differently can take the layer back", () => {
  expect(ci().name).toBe("run.ci");
});
