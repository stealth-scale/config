import { describe, expect, it } from "vitest";

import { CATEGORIES } from "#lint/rules/index.ts";
import { defineConfig } from "#preset/base.ts";
import { readBack } from "#preset/preset.fixtures.ts";

/**
 * Where the config under specification is: this package's own root.
 *
 * A config file sits at a package root, and the tier reads the manifest beside it. Naming this
 * directory instead would hand the layers a directory holding no manifest at all.
 */
const AT = new URL("../..", import.meta.url).pathname;

describe("base", () => {
  it("declares nothing about where the package runs", async () => {
    expect((await readBack(defineConfig(AT, {}))).lint?.env).toBeUndefined();
  });

  it("lints with type information and fails on what it finds", async () => {
    expect((await readBack(defineConfig(AT, {}))).lint).toMatchObject({
      categories: CATEGORIES,
      options: { typeAware: true, typeCheck: true },
    });
  });

  it("lets a caller's own keys through", async () => {
    expect((await readBack(defineConfig(AT, { publicDir: "theirs" }))).publicDir).toBe("theirs");
  });

  it("sets every field of the house format", async () => {
    const held = (await readBack(defineConfig(AT, {}))).fmt;

    expect(held?.proseWrap, "fmt.prose is missing").toBe("always");
    expect(held?.jsdoc, "fmt.docblocks is missing").toBeTruthy();
    expect(held?.sortImports, "fmt.imports is missing").toBeTruthy();
    expect(held?.ignorePatterns, "fmt.generated is missing").not.toHaveLength(0);
    expect(held?.printWidth, "fmt.style is missing").toBe(100);
    expect(held?.sortPackageJson, "fmt.manifests is missing").toBe(true);
  });
});
