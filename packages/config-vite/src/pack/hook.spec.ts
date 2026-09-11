import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { type Context } from "@stealthscale/config-core";

import { hook } from "#pack/hook.ts";

/**
 * What a refinement is handed, which this layer never reads.
 */
const ANY: Context = {
  at: "/repository/packages/one",
  command: "build",
  env: {},
  manifest: {},
  mode: "production",
  root: "/repository",
};

/**
 * Stands in for a repository's own code, told apart by identity rather than by what it does.
 */
function one(): void {
  return undefined;
}

/**
 * Stands in for a second piece of it.
 */
function two(): void {
  return undefined;
}

/**
 * Runs a layer's refinement over a config and answers the hooks it left.
 *
 * @param config - The config as the layers composed it.
 * @param hooks - The hooks to add.
 * @returns The hooks on the refined config.
 */
function refined(config: UserConfig, hooks: Record<string, () => void>): Record<string, unknown> {
  const held = hook({ because: "a theme writes its stylesheet", hooks }).refine(ANY, config);

  return (held.pack as { hooks: Record<string, unknown> }).hooks;
}

test("runs the code it was given at the moment it named", () => {
  expect(refined({}, { "build:before": one })["build:before"]).toBe(one);
});

test("keeps a hook another layer already asked for", () => {
  const held = refined({ pack: { hooks: { "build:before": one } } }, { "build:done": two });

  expect(held["build:before"]).toBe(one);
  expect(held["build:done"]).toBe(two);
});

test("wins over a hook stated for the same moment, the later layer being the nearer one", () => {
  const held = refined({ pack: { hooks: { "build:before": one } } }, { "build:before": two });

  expect(held["build:before"]).toBe(two);
});

test("adds hooks to a config that named none", () => {
  expect(refined({ pack: {} }, { "build:prepare": one })["build:prepare"]).toBe(one);
});

test("passes over hooks stated as a function, which nothing could merge with", () => {
  const held = refined({ pack: { hooks: one } }, { "build:before": one });

  expect(held["build:before"]).toBe(one);
});

test("leaves the rest of the pack settings alone", () => {
  const held = hook({ because: "why", hooks: {} }).refine(ANY, { pack: { dts: true } });

  expect((held.pack as { dts: boolean }).dts).toBe(true);
});

test("leaves the rest of the config alone", () => {
  const held = hook({ because: "why", hooks: {} }).refine(ANY, { test: { globals: true } });

  expect(held.test?.globals).toBe(true);
});

test("passes over a packer configured as a list, every layer here describing one package", () => {
  const held = hook({ because: "why", hooks: {} }).refine(ANY, { pack: [{ dts: true }] });

  expect((held.pack as { dts?: boolean }).dts).toBeUndefined();
});

test("carries the reason, this being the least legible layer a config can hold", () => {
  expect(hook({ because: "a theme writes its stylesheet", hooks: {} }).because).toBe(
    "a theme writes its stylesheet",
  );
});

test("names the moments it runs at, so provenance says what reaches past the layers", () => {
  const held = hook({ because: "why", hooks: { "build:before": one, "build:done": two } });

  expect(held.name).toBe("pack.hook(build:before, build:done)");
});
