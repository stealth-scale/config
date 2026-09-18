import { describe, expect, it, vi } from "vitest";

import { declarations } from "#declarations.ts";

/**
 * What the reader returned with the other deployment unreachable.
 */
interface Refused {
  /**
   * The declarations it returned, which is none.
   */
  readonly declared: readonly unknown[];

  /**
   * How many times it said so.
   */
  readonly warnings: number;
}

/**
 * Loads the reader again, with the other deployment unreachable.
 *
 * @remarks
 *   The mock and the spy are put up and taken down here rather than in a hook, so a case that
 *   reaches the other deployment is unaffected by one that does not.
 * @returns What it returned, and how loudly.
 */
async function unreachable(): Promise<Refused> {
  const warn = vi.spyOn(globalThis.console, "warn").mockImplementation(() => {});

  vi.resetModules();
  vi.doMock(import("remote/routes"), () => {
    throw new Error("the other deployment is unreachable");
  });

  const { declarations: again } = await import("#declarations.ts");
  const declared = await again();
  const warnings = warn.mock.calls.length;

  warn.mockRestore();
  vi.doUnmock("remote/routes");
  vi.resetModules();

  return { declared, warnings };
}

describe("declarations", () => {
  it("returns what the other deployment declares", async () => {
    expect((await declarations()).map((one) => one.id)).toStrictEqual(["remote.dashboard"]);
  });

  it("returns the address that deployment asked for", async () => {
    expect((await declarations())[0]?.path).toBe("/reports");
  });

  it("returns nothing where the other deployment cannot be reached", async () => {
    expect((await unreachable()).declared).toStrictEqual([]);
  });

  it("says so once where it cannot be reached", async () => {
    expect((await unreachable()).warnings).toBe(1);
  });
});
