import { expect, test } from "vite-plus/test";

import { imports } from "#fmt/imports.ts";

test("names react and react-dom, which the toolchain cannot name on its own behalf", () => {
  expect(imports().name).toBe("fmt.group(react)");
});

test("is an override, because the group and the order have to change together", () => {
  expect(imports().kind).toBe("override");
});

test("says why, so a later reader can weigh it", () => {
  expect(imports().because).toContain("renders");
});
