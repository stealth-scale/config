/**
 * Proves the node tier grants node's globals and withholds the browser's.
 */

import { describe, expect, it } from "vitest";

import { CATEGORIES } from "#lint/rules/index.ts";
import { defineConfig } from "#preset/node.ts";
import { readBack } from "#preset/preset.fixtures.ts";

/**
 * The package root, which is where a tier expects to find a manifest.
 */
const AT = new URL("../..", import.meta.url).pathname;

describe("node", () => {
  it("gives the package node's globals", async () => {
    expect((await readBack(defineConfig(AT, {}))).lint?.env).toStrictEqual({ node: true });
  });

  it("withholds the browser globals", async () => {
    expect((await readBack(defineConfig(AT, {}))).lint?.env).not.toHaveProperty("browser");
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
