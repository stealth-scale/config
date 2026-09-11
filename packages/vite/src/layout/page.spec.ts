import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { page } from "#layout/page.ts";

/**
 * Reads the config the preset sets.
 *
 * @param at - The directory holding the page.
 * @returns That config.
 */
function configOf(at: string): UserConfig {
  return page(at).config as UserConfig;
}

test("roots the build at the directory holding the page", () => {
  expect(configOf("public").root).toBe("public");
});

test("writes the build beside the root rather than inside the directory it built from", () => {
  expect(configOf("public").build?.outDir).toBe("../dist");
});

test("climbs once for every segment, so a nested page still writes beside the package", () => {
  expect(configOf("app/html").build?.outDir).toBe("../../dist");
});

test("empties the output, which it has to because the output sits outside the root", () => {
  expect(configOf("public").build?.emptyOutDir).toBe(true);
});

test("stops looking for static files below the page", () => {
  expect(configOf("public").publicDir).toBe(false);
});

test("leaves the test runner looking at the package rather than at the page", () => {
  expect(configOf("public").test?.root).toBe(".");
});

test("names the directory it rooted, so a repository moving its page can take it back", () => {
  expect(page("public").name).toBe("layout.page(public)");
});
