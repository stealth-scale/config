import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { docblocks } from "#fmt/docblock.ts";
import { DOCBLOCK } from "#lint/rules/docblock.ts";

/**
 * Reads the docblock settings the preset sets.
 *
 * @returns Those settings.
 */
function settings(): Record<string, unknown> {
  const held = (docblocks().config as UserConfig).fmt?.jsdoc;

  return held as Record<string, unknown>;
}

describe("docblock", () => {
  it("keeps a block on several lines", () => {
    expect(settings()["commentLineStrategy"]).toBe("multiline");
  });

  it("ends every description with a full stop", () => {
    expect(settings()["descriptionWithDot"]).toBe(true);
  });

  it("agrees with the rule that refuses a single-line block", () => {
    const held = DOCBLOCK["jsdoc-js/multiline-blocks"] as [string, { noSingleLineBlocks: boolean }];

    expect(held[1].noSingleLineBlocks).toBe(true);
    expect(settings()["commentLineStrategy"]).toBe("multiline");
  });

  it("wraps a continuation where the rule checking the wrap expects to find it", () => {
    const held = DOCBLOCK["jsdoc-js/check-line-alignment"] as [
      string,
      string,
      { wrapIndent: string },
    ];

    expect(held[2].wrapIndent).toBe("  ");
  });
});
