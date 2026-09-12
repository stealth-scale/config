import { expect, test } from "vite-plus/test";

import { plugins } from "#lint/plugin.ts";

test("turns on the plugins whose rules know what a component is", () => {
  expect(plugins().map((one) => one.item)).toEqual(["react", "jsx-a11y"]);
});

test("leaves react-perf off, the compiler this package turns on memoising what it asks for", () => {
  expect(plugins().map((one) => one.item)).not.toContain("react-perf");
});

test("contributes one at a time, so a repository can take one back by name", () => {
  expect(plugins().map((one) => one.name)).toEqual([
    "react.plugin(react)",
    "react.plugin(jsx-a11y)",
  ]);
});

test("appends to the list the toolchain already built rather than replacing it", () => {
  for (const held of plugins()) expect(held.at).toBe("lint.plugins");
});
