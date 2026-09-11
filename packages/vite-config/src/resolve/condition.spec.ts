import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { source } from "#pack/source.ts";
import { SOURCE } from "#resolve/condition.ts";

/**
 * Reads a JSON file beside this package.
 *
 * @param at - Where it sits, relative to this file.
 * @returns Its parsed contents.
 */
function read(at: string): Record<string, unknown> {
  return JSON.parse(readFileSync(new URL(at, import.meta.url).pathname, "utf8")) as Record<
    string,
    unknown
  >;
}

/**
 * Reads a JSON file another package publishes.
 *
 * Resolved by the subpath a consumer imports rather than by a path across the workspace, so moving
 * the package it lives in cannot silently point this somewhere else.
 *
 * @param specifier - The subpath, as a consumer writes it.
 * @returns Its parsed contents.
 */
function published(specifier: string): Record<string, unknown> {
  const at = createRequire(import.meta.url).resolve(specifier);

  return JSON.parse(readFileSync(at, "utf8")) as Record<string, unknown>;
}

test("is the condition the shared tsconfig switches on", () => {
  const options = published("@stealthscale/vite-config-typescript/base.json")[
    "compilerOptions"
  ] as {
    customConditions: string[];
  };

  expect(options.customConditions).toEqual([SOURCE]);
});

test("is the condition this package publishes its source under", () => {
  const exported = read("../../package.json")["exports"] as Record<string, unknown>;

  for (const [path, held] of Object.entries(exported)) {
    if (typeof held !== "object" || held === null) continue;
    expect(Object.keys(held), `${path} does not publish source under ${SOURCE}`).toContain(SOURCE);
  }
});

test("is the condition the packer is told to write", () => {
  const held = (source().config as UserConfig).pack as { exports: { devExports: string } };

  expect(held.exports.devExports).toBe(SOURCE);
});
