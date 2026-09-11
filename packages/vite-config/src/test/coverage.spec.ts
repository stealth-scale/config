import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { FOREIGN } from "#ignore/foreign.ts";
import { GENERATED } from "#ignore/generated.ts";
import { coverage } from "#test/coverage.ts";

/**
 * Reads the coverage settings the preset sets.
 *
 * @returns Those settings.
 */
function settings(): Record<string, unknown> {
  const held = (coverage().config as UserConfig).test?.coverage;

  return held as Record<string, unknown>;
}

test("counts with the engine's own coverage rather than an instrumented build", () => {
  expect(settings()["provider"]).toBe("v8");
});

test("leaves out the measurement, the fixtures and the configs, which are not source", () => {
  const held = settings()["exclude"] as string[];

  expect(held).toContain("**/*.spec.{ts,tsx}");
  expect(held).toContain("**/*.fixtures.{ts,tsx}");
  expect(held).toContain("**/*.config.ts");
});

test("leaves out what a tool wrote, the same list the linter and formatter walk past", () => {
  const held = settings()["exclude"] as string[];

  for (const glob of GENERATED) expect(held).toContain(glob);
});

test("reports for a reader and for a machine, and drops the two nobody opens", () => {
  expect(settings()["reporter"]).toEqual(["text", "html", "lcov"]);
});

test("asks for all of it, which is the one number that needs no explaining", () => {
  const held = settings()["thresholds"] as Record<string, unknown>;

  expect(held["branches"]).toBe(100);
  expect(held["functions"]).toBe(100);
  expect(held["lines"]).toBe(100);
  expect(held["statements"]).toBe(100);
});

test("measures the package rather than each file, so no small file has to be perfect", () => {
  const held = settings()["thresholds"] as Record<string, unknown>;

  expect(held["perFile"]).toBe(false);
});

test("counts neither what was installed nor what was built", () => {
  const held = settings()["exclude"] as string[];

  for (const glob of FOREIGN) expect(held).toContain(glob);
});
