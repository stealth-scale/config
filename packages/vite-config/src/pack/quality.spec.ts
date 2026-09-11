import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { quality } from "#pack/quality.ts";

/**
 * Reads back the checks the layer turns on.
 *
 * @returns The packer's two checks, as stated.
 */
function checked(): { attw: { excludeEntrypoints: RegExp[] }; publint: boolean } {
  return (quality().config as UserConfig).pack as {
    attw: { excludeEntrypoints: RegExp[] };
    publint: boolean;
  };
}

test("turns on both manifest checks, neither of which the packer runs on its own", () => {
  expect(checked().attw).toBeTruthy();
  expect(checked().publint).toBe(true);
});

test("stops the type checker resolving a stylesheet, which has no types to resolve", () => {
  expect(checked().attw.excludeEntrypoints.some((one) => one.test("./dist/style.css"))).toBe(true);
});

test("leaves a module to the type checker, that being what it is for", () => {
  expect(checked().attw.excludeEntrypoints.some((one) => one.test("./dist/index.js"))).toBe(false);
});

test("names itself, so a package that cannot pass them yet can take the layer back", () => {
  expect(quality().name).toBe("pack.quality");
});
