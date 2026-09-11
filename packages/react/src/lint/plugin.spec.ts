import { expect, test } from "vite-plus/test";

import { plugins } from "#lint/plugin.ts";

test("turns on the three plugins whose rules know what a component is", () => {
  expect(plugins().map((one) => one.item)).toEqual(["react", "react-perf", "jsx-a11y"]);
});

test("contributes one at a time, so a repository can take one back by name", () => {
  expect(plugins().map((one) => one.name)).toEqual([
    "react.plugin(react)",
    "react.plugin(react-perf)",
    "react.plugin(jsx-a11y)",
  ]);
});

test("appends to the list the toolchain already built rather than replacing it", () => {
  for (const held of plugins()) expect(held.at).toBe("lint.plugins");
});
