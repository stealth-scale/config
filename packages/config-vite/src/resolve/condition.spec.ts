import { readFileSync } from "node:fs";
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

test("is the condition the shared tsconfig switches on", () => {
  const options = read("../../../typescript/base.json")["compilerOptions"] as {
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
