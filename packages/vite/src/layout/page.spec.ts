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

test("builds from the page in the directory it was given", () => {
  expect(configOf("public").build?.rolldownOptions?.input).toBe("public/index.html");
});

test("leaves the project root alone, which every other tool resolves against", () => {
  expect(configOf("public").root).toBeUndefined();
});

test("says nothing about where tests live, so the runner keeps looking where it looked", () => {
  expect(configOf("public").test).toBeUndefined();
});

test("stops looking for static files below the page, which is where the page now is", () => {
  expect(configOf("public").publicDir).toBe(false);
});

test("names the directory it built from, so a repository moving its page can take it back", () => {
  expect(page("public").name).toBe("layout.page(public)");
});
