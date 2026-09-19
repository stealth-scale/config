import { describe, expect, it } from "vitest";

import { PRIORITIES, type Priority } from "#folding/priority.ts";

describe("PRIORITIES", () => {
  it("lists three priorities", () => {
    expect(PRIORITIES).toHaveLength(3);
  });

  it("lists them from the one that survives to the one that goes first", () => {
    expect(PRIORITIES).toStrictEqual(["primary", "secondary", "tertiary"]);
  });

  it("names a priority the type allows", () => {
    const held: Priority = "secondary";

    expect(PRIORITIES).toContain(held);
  });
});
