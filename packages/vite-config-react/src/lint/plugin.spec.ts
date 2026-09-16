import { describe, expect, it } from "vitest";

import { plugins } from "#lint/plugin.ts";

describe("plugin", () => {
  it("turns on the plugins whose rules know what a component is", () => {
    expect(plugins().map((one) => one.item)).toStrictEqual(["react", "jsx-a11y"]);
  });

  it("leaves react-perf off", () => {
    expect(plugins().map((one) => one.item)).not.toContain("react-perf");
  });

  it("contributes one plugin at a time", () => {
    expect(plugins().map((one) => one.name)).toStrictEqual([
      "react.lint.plugins(react)",
      "react.lint.plugins(jsx-a11y)",
    ]);
  });

  it("appends to the list the toolchain already built rather than replacing it", () => {
    for (const held of plugins()) expect(held.at).toBe("lint.plugins");
  });
});
