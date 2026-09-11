import { expect, test } from "vite-plus/test";

import { CATEGORIES } from "#lint/rules/index.ts";
import { defineConfig } from "#preset/base.ts";
import { readBack } from "#preset/preset.fixtures.ts";

test("says nothing about where the package runs", async () => {
  expect((await readBack(defineConfig({}))).lint?.env).toBeUndefined();
});

test("lints with the type checker's answers, and fails on what they find", async () => {
  expect((await readBack(defineConfig({}))).lint).toMatchObject({
    categories: CATEGORIES,
    options: { typeAware: true, typeCheck: true },
  });
});

test("still lets a caller's own keys through", async () => {
  expect((await readBack(defineConfig({ publicDir: "theirs" }))).publicDir).toBe("theirs");
});

test("carries the house format whole, so a repository states none of it", async () => {
  const held = (await readBack(defineConfig({}))).fmt;

  expect(held?.proseWrap, "fmt.prose is missing").toBe("always");
  expect(held?.jsdoc, "fmt.docblocks is missing").toBeTruthy();
  expect(held?.sortImports, "fmt.imports is missing").toBeTruthy();
  expect(held?.ignorePatterns, "fmt.generated is missing").not.toHaveLength(0);
  expect(held?.printWidth, "fmt.style is missing").toBe(100);
  expect(held?.sortPackageJson, "fmt.manifests is missing").toBe(true);
});
