import { expect, test } from "vite-plus/test";

import { CATEGORIES } from "#lint/rules/index.ts";
import { readBack } from "#preset/preset.fixtures.ts";
import { defineConfig } from "#preset/web.ts";

/**
 * Where the config under specification is, which every `defineConfig` states for itself.
 */
const AT = import.meta.dirname;

test("gives the package the browser's globals, so `document` is not undefined", async () => {
  expect((await readBack(defineConfig(AT, {}))).lint?.env).toEqual({ browser: true });
});

test("withholds node's, so reaching for `process` is reported", async () => {
  expect((await readBack(defineConfig(AT, {}))).lint?.env).not.toHaveProperty("node");
});

test("carries the linting every entry shares", async () => {
  expect((await readBack(defineConfig(AT, {}))).lint).toMatchObject({
    categories: CATEGORIES,
    options: { typeAware: true, typeCheck: true },
  });
});

test("carries the house format whole, so a repository states none of it", async () => {
  const held = (await readBack(defineConfig(AT, {}))).fmt;

  expect(held?.proseWrap, "fmt.prose is missing").toBe("always");
  expect(held?.jsdoc, "fmt.docblocks is missing").toBeTruthy();
  expect(held?.sortImports, "fmt.imports is missing").toBeTruthy();
  expect(held?.ignorePatterns, "fmt.generated is missing").not.toHaveLength(0);
  expect(held?.printWidth, "fmt.style is missing").toBe(100);
  expect(held?.sortPackageJson, "fmt.manifests is missing").toBe(true);
});
