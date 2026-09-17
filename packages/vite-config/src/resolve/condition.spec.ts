/**
 * Proves the source condition is spelled the same way in every place that reads
 * it.
 */

import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { type UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { source } from "#pack/source.ts";
import { SOURCE } from "#resolve/condition.ts";

/**
 * Parses a JSON file named relative to this one.
 */
function read(at: string): Record<string, unknown> {
  return JSON.parse(readFileSync(new URL(at, import.meta.url).pathname, "utf8")) as Record<
    string,
    unknown
  >;
}

/**
 * Parses a JSON file reached through node's resolver, as a consumer of the
 * package would.
 */
function published(specifier: string): Record<string, unknown> {
  const at = createRequire(import.meta.url).resolve(specifier);

  return JSON.parse(readFileSync(at, "utf8")) as Record<string, unknown>;
}

describe("condition", () => {
  it("is the condition the shared tsconfig switches on", () => {
    const options = published("@stealthscale/vite-config-typescript/base.json")[
      "compilerOptions"
    ] as {
      customConditions: string[];
    };

    expect(options.customConditions).toStrictEqual([SOURCE]);
  });

  it("is the condition this package publishes its source under", () => {
    const exported = read("../../package.json")["exports"] as Record<string, unknown>;

    for (const [path, held] of Object.entries(exported)) {
      if (typeof held !== "object" || held === null) continue;

      expect(Object.keys(held), `${path} does not publish source under ${SOURCE}`).toContain(
        SOURCE,
      );
    }
  });

  it("is the condition the packer is told to write", () => {
    const held = (source().config as UserConfig).pack as { exports: { devExports: string } };

    expect(held.exports.devExports).toBe(SOURCE);
  });
});
