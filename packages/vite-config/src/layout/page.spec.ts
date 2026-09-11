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
  expect(configOf("page").build?.rolldownOptions?.input).toBe("page/index.html");
});

test("leaves the project root alone, which every other tool resolves against", () => {
  expect(configOf("page").root).toBeUndefined();
});

test("says nothing about where tests live, so the runner keeps looking where it looked", () => {
  expect(configOf("page").test).toBeUndefined();
});

test("leaves the static files alone, so an application still ships a favicon", () => {
  expect(configOf("page").publicDir).toBeUndefined();
});

test("refuses the directory the static files live in, which the copy would land on top of", () => {
  expect(() => page("public")).toThrow(/would put the page where/u);
});

test("names the directory it built from, so a repository moving its page can take it back", () => {
  expect(page("page").name).toBe("layout.page(page)");
});
