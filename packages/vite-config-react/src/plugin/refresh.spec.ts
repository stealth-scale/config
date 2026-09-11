import { readFileSync } from "node:fs";
import { expect, test } from "vite-plus/test";

import { FACTORY, options, refresh } from "#plugin/refresh.ts";

/**
 * A file kind the plugin does not compile until it is asked to.
 */
const MDX = /\.mdx$/u;

/**
 * Reads the tsconfig this package ships.
 *
 * @returns Its compiler options.
 */
function shipped(): Record<string, unknown> {
  const source = readFileSync(new URL("../../web.json", import.meta.url).pathname, "utf8");
  const held = JSON.parse(source) as { compilerOptions: Record<string, unknown> };

  return held.compilerOptions;
}

test("appends to the list of plugins rather than replacing whatever else is there", () => {
  expect(refresh().at).toBe("plugins");
});

test("is named so a repository swapping the transform can take it back", () => {
  expect(refresh().name).toBe("react.refresh");
});

test("compiles every TypeScript, JavaScript and rendering-markdown file", () => {
  expect(options({}).include).toEqual([/\.[tj]sx?$/u, /\.mdx$/u]);
});

test("adds a file kind without dropping the ones it already compiled", () => {
  const extra = /\.svelte$/u;

  expect(options({ also: [extra] }).include).toEqual([/\.[tj]sx?$/u, MDX, extra]);
});

test("leaves the dependencies alone, and keeps doing so when more are added", () => {
  expect(options({}).exclude).toEqual([/\/node_modules\//u]);
  expect(options({ except: [MDX] }).exclude).toEqual([/\/node_modules\//u, MDX]);
});

test("imports the factory from React unless the repository renders through something else", () => {
  expect(options({}).jsxImportSource).toBe(FACTORY);
  expect(options({ from: "@emotion/react" }).jsxImportSource).toBe("@emotion/react");
});

test("compiles against the same factory the shipped tsconfig type-checks against", () => {
  expect(shipped()["jsxImportSource"] ?? FACTORY).toBe(FACTORY);
});

test("uses the automatic runtime, which the tsconfig and the lint relaxation both assume", () => {
  expect(options({}).jsxRuntime).toBe("automatic");
  expect(shipped()["jsx"]).toBe("react-jsx");
});

test("memoises with the compiler, which is the build the house ships and tests", () => {
  expect(options({}).compiler).toBe(true);
});

test("lets a package the compiler cannot reason about turn it off while that is fixed", () => {
  expect(options({ compiler: false }).compiler).toBe(false);
});
