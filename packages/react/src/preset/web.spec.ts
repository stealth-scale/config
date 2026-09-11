import { expect, test } from "vite-plus/test";

import { layers, workspace } from "#preset/web.ts";

test("names every layer under this package, so provenance says where it came from", () => {
  for (const held of [...layers(), ...workspace()]) {
    expect(held.name.startsWith("react/")).toBe(true);
  }
});

test("states at the root the format and the rules, which are read from there and nowhere else", () => {
  const held = workspace().map((one) => one.name);

  expect(held).toContain("react/fmt.group(react)");
  expect(held.some((one) => one.includes("lint.enforce"))).toBe(true);
  expect(held.some((one) => one.includes("lint.relax"))).toBe(true);
});

test("turns on all three linter plugins, at the root where the linter reads them", () => {
  expect(workspace().filter((one) => one.name.includes("react.plugin("))).toHaveLength(3);
});

test("states in the package what compiles its JSX and where its page sits", () => {
  const held = layers().map((one) => one.name);

  expect(held).toContain("react/layout.page(public)");
  expect(held).toContain("react/react.refresh");
});

test("keeps the two apart, so a root config is never rooted at a page it does not have", () => {
  const root = workspace().map((one) => one.name);
  const stated = layers().map((one) => one.name);

  expect(root.some((one) => one.includes("layout.page"))).toBe(false);
  expect(stated.some((one) => one.includes("lint."))).toBe(false);
});
