import { expect, test } from "vite-plus/test";

import { layers } from "#preset/app.ts";
import { PAGE } from "#preset/page.ts";

test("names a directory inside the package, which is where a page can be served from", () => {
  expect(PAGE).not.toContain("..");
  expect(PAGE.startsWith("/")).toBe(false);
});

test("is the string the preset lays the page out under, rather than a second copy of it", () => {
  expect(layers().map((one) => one.name)).toContain(`react/layout.page(${PAGE})`);
});
