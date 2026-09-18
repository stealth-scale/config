import { describe, expect, it } from "vitest";

import { withScratchWorkspaceAsync } from "@stealthscale/testing";

import { type Compiler, compiler } from "#anatomy/compiler.ts";
import { kit } from "#anatomy/kit.fixtures.ts";
import { settled } from "#anatomy/reading.ts";

function opened<Result>(
  run: (held: Compiler, path: (relative: string) => string) => Result,
): Promise<Result> {
  return withScratchWorkspaceAsync(kit(), async (scratch) => {
    const held = await compiler(scratch.root);

    try {
      return run(held, (relative) => scratch.path(relative));
    } finally {
      held.close();
    }
  });
}

describe("compiler", () => {
  it("reads the parts a specimen documents", async () => {
    const held = await opened((compiled, path) =>
      compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({})),
    );

    expect(Object.keys(held.parts).toSorted()).toStrictEqual(["BadgeProps", "OtherProps"]);
  });

  it("reads a second specimen through the same process", async () => {
    const held = await opened((compiled, path) => {
      compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({}));

      return compiled.anatomyOf(path("src/parts.specimen.tsx"), settled({}));
    });

    expect(Object.keys(held.parts)).toStrictEqual(["BadgeProps"]);
  });

  it("reads one specimen twice without opening it again", async () => {
    const held = await opened((compiled, path) => {
      compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({}));

      return compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({}));
    });

    expect(Object.keys(held.parts)).toHaveLength(2);
  });

  it("reads afresh after a restart", async () => {
    const held = await opened((compiled, path) => {
      compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({}));
      compiled.restart();

      return compiled.anatomyOf(path("src/badge/badge.specimen.tsx"), settled({}));
    });

    expect(Object.keys(held.parts)).toHaveLength(2);
  });

  it("throws naming the file when no project holds it", async () => {
    await expect(
      opened((compiled, path) => compiled.anatomyOf(path("elsewhere.ts"), settled({}))),
    ).rejects.toThrow(/a project holding .*elsewhere\.ts/u);
  });

  it("stops without complaint when it was never started", async () => {
    const held = await withScratchWorkspaceAsync(kit(), (scratch) => compiler(scratch.root));

    expect(() => {
      held.close();
    }).not.toThrow();
  });
});
