import { expect, test } from "vite-plus/test";

import { type Commands, type Moments, type Packing } from "#pack/settings.ts";

/**
 * Stands in for whatever a repository would run, told apart by identity alone.
 */
function ran(): void {
  return undefined;
}

test("narrows the packer to one configuration, every layer here describing one package", () => {
  const held: Packing = { dts: true, entry: { index: "src/index.ts" } };

  expect(held.dts).toBe(true);
});

test("refuses a moment the packer does not run", () => {
  // @ts-expect-error -- the packer runs `build:prepare`, `build:before` and `build:done`.
  const held: Moments = { "build:whenever": ran };

  expect(Object.keys(held)).toHaveLength(1);
});

test("takes the hooks as a map rather than as the registrar the packer also accepts", () => {
  const held: Moments = { "build:done": ran };

  expect(typeof held["build:done"]).toBe("function");
});

test("names a command against the file behind it", () => {
  const held: Commands = { stealth: "src/bin/stealth.ts" };

  expect(held["stealth"]).toBe("src/bin/stealth.ts");
});
