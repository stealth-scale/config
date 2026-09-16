import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { command } from "#staged/command.ts";

/**
 * Reads back the staged rules the layer states.
 *
 * @param held - The layer.
 * @returns Each glob against what runs on it.
 */
function staged(held: ReturnType<typeof command>): Record<string, unknown> {
  return (held.config as UserConfig).staged as Record<string, unknown>;
}

describe("command", () => {
  it("runs the command it was given over the glob it was given", () => {
    expect(staged(command("*.sql", "sqlfluff fix"))).toStrictEqual({ "*.sql": "sqlfluff fix" });
  });

  it("runs several in the order they were written", () => {
    expect(staged(command("*.sql", ["one", "two"]))["*.sql"]).toStrictEqual(["one", "two"]);
  });

  it("copies the list it was given", () => {
    const runs = ["one"];

    expect(staged(command("*.sql", runs))["*.sql"]).not.toBe(runs);
  });

  it("names the glob", () => {
    expect(command("*.sql", "x").name).toBe("staged.command(*.sql)");
  });
});
