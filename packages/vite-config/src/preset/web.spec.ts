/**
 * Proves the web tier grants the browser's globals and withholds node's.
 */

import { describe, expect, it } from "vitest";

import { CATEGORIES } from "#lint/rules/index.ts";
import { readBack } from "#preset/preset.fixtures.ts";
import { defineConfig } from "#preset/web.ts";

/**
 * The package root, which is where a tier expects to find a manifest.
 */
const AT = new URL("../..", import.meta.url).pathname;

describe("web", () => {
  it("gives the package the browser's globals", async () => {
    expect((await readBack(defineConfig(AT, {}))).lint?.env).toStrictEqual({ browser: true });
  });

  it("withholds the node globals", async () => {
    expect((await readBack(defineConfig(AT, {}))).lint?.env).not.toHaveProperty("node");
  });

  it("includes the linting every entry shares", async () => {
    expect((await readBack(defineConfig(AT, {}))).lint).toMatchObject({
      categories: CATEGORIES,
      options: { typeAware: true, typeCheck: true },
    });
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
