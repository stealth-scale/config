import { expect, test } from "vite-plus/test";

import { workspace } from "#preset/workspace.ts";

test("names every layer under this package, so a repository can take one back", () => {
  for (const held of workspace()) {
    expect(held.name.startsWith("react/")).toBe(true);
  }
});

test("states the format and the rules, which a root config is read for and nothing else is", () => {
  const held = workspace().map((one) => one.name);

  expect(held).toContain("react/fmt.group(react)");
  expect(held.some((one) => one.includes("lint.enforce"))).toBe(true);
  expect(held.some((one) => one.includes("lint.relax"))).toBe(true);
});

test("turns the linter plugins on at the root, where the linter reads them", () => {
  expect(workspace().filter((one) => one.name.includes("react.plugin("))).toHaveLength(2);
});

test("lays out no page, a workspace root being rooted at no application", () => {
  expect(workspace().some((one) => one.name.includes("layout.page"))).toBe(false);
});

test("packs and builds nothing, a workspace root being neither published nor deployed", () => {
  const held = workspace()
    .map((one) => one.name)
    .join();

  expect(held).not.toContain("pack.");
  expect(held).not.toContain("build.");
});
