import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { type Layer, type Preset } from "@stealthscale/config-core";

import { GENERATED } from "#ignore/generated.ts";
import { base, node, web } from "#lint/preset.ts";
import * as rules from "#lint/rules/index.ts";

/**
 * Reads the `lint` block the preset among some layers sets.
 *
 * @param layers - What one of the entries answered.
 * @returns Its lint block.
 */
function blockOf(layers: readonly Layer[]): NonNullable<UserConfig["lint"]> {
  const held = layers.find((one) => one.kind === "preset") as Preset;

  return (held.config as UserConfig).lint as NonNullable<UserConfig["lint"]>;
}

/**
 * Reads what every layer an entry answered is called.
 *
 * @param layers - What one of the entries answered.
 * @returns Their names.
 */
function namesOf(layers: readonly Layer[]): readonly string[] {
  return layers.map((one) => one.name);
}

test("sets a block rather than appending to a list", () => {
  expect(base().some((one) => one.kind === "preset")).toBe(true);
});

test("names itself, so the provenance report can say what decided a value", () => {
  expect(namesOf(base())).toContain("lint.base");
  expect(namesOf(node())).toContain("lint.node");
  expect(namesOf(web())).toContain("lint.web");
});

test("lets the linter see a type, which is most of what there is to get wrong", () => {
  expect(blockOf(base()).options).toMatchObject({ typeAware: true, typeCheck: true });
});

test("fails on a finding rather than warning about it", () => {
  expect(blockOf(base()).categories).toBe(rules.CATEGORIES);
});

test("holds the package to every rule group", () => {
  expect(blockOf(base()).rules).toEqual(rules.base());
});

test("names the plugins its rules are written against", () => {
  expect(blockOf(base()).plugins).toBe(rules.PLUGINS);
});

test("walks past what a tool wrote", () => {
  expect(blockOf(base()).ignorePatterns).toEqual([...GENERATED]);
});

test("says nothing about where a package runs, where it is the base", () => {
  expect(blockOf(base()).env).toBeUndefined();
});

test("gives a package the console runs node's globals, and not the browser's", () => {
  expect(blockOf(node()).env).toEqual({ node: true });
});

test("gives a package the browser runs the browser's globals, and not node's", () => {
  expect(blockOf(web()).env).toEqual({ browser: true });
});

test("carries everything the base does, so an environment is added rather than swapped for", () => {
  for (const held of [node(), web()]) {
    expect(blockOf(held)).toMatchObject({
      categories: blockOf(base()).categories,
      options: blockOf(base()).options,
      plugins: blockOf(base()).plugins,
    });
  }
});

test("excuses a config file and a specification whichever entry was picked", () => {
  for (const held of [base(), node(), web()]) {
    expect(namesOf(held)).toContain("lint.relax(**/*.config.ts)");
    expect(held.some((one) => one.name.includes("*.spec.ts"))).toBe(true);
  }
});

test("excuses no rendered specification where the package runs in the console", () => {
  for (const held of [base(), node()]) {
    expect(held.some((one) => one.name.includes("*.spec.tsx"))).toBe(false);
  }
});

test("excuses one where the package renders, since markup is why it is written that way", () => {
  expect(web().some((one) => one.name.includes("*.spec.tsx"))).toBe(true);
});
