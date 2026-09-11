import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

import { on } from "#staged/on.ts";

/**
 * Reads back the staged rules the layer states.
 *
 * @param held - The layer.
 * @returns Each glob against what runs on it.
 */
function staged(held: ReturnType<typeof on>): Record<string, unknown> {
  return (held.config as UserConfig).staged as Record<string, unknown>;
}

test("runs the command it was given over the glob it was given", () => {
  expect(staged(on("*.sql", "sqlfluff fix"))).toEqual({ "*.sql": "sqlfluff fix" });
});

test("runs several in the order they were written", () => {
  expect(staged(on("*.sql", ["one", "two"]))["*.sql"]).toEqual(["one", "two"]);
});

test("copies the list, so a caller's array is not the runner's", () => {
  const runs = ["one"];

  expect(staged(on("*.sql", runs))["*.sql"]).not.toBe(runs);
});

test("names the glob, so one can be taken back without the rest", () => {
  expect(on("*.sql", "x").name).toBe("staged.on(*.sql)");
});
