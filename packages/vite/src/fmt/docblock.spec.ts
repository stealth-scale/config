import { type UserConfig } from "vite-plus";
import { expect, test } from "vite-plus/test";

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

test("keeps a block on several lines, since one collapsed onto a line reads as a label", () => {
  expect(settings()["commentLineStrategy"]).toBe("multiline");
});

test("ends every description with a full stop", () => {
  expect(settings()["descriptionWithDot"]).toBe(true);
});

test("agrees with the rule that refuses a single-line block, which fires if it ever stops", () => {
  const held = DOCBLOCK["jsdoc-js/multiline-blocks"] as [string, { noSingleLineBlocks: boolean }];

  expect(held[1].noSingleLineBlocks).toBe(true);
  expect(settings()["commentLineStrategy"]).toBe("multiline");
});

test("wraps a continuation where the rule checking the wrap expects to find it", () => {
  const held = DOCBLOCK["jsdoc-js/check-line-alignment"] as [
    string,
    string,
    { wrapIndent: string },
  ];

  expect(held[2].wrapIndent).toBe("  ");
});
