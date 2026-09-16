/**
 * Checks that prose is wrapped, and wrapped the way a doc comment is.
 */

import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { docblocks } from "#fmt/docblock.ts";
import { prose } from "#fmt/prose.ts";

describe("prose", () => {
  it("wraps a paragraph rather than leaving it as it was typed", () => {
    expect((prose().config as UserConfig).fmt?.proseWrap).toBe("always");
  });

  it("wraps prose outside code the same way a docblock wraps prose inside it", () => {
    const held = (docblocks().config as UserConfig).fmt?.jsdoc as Record<string, unknown>;

    expect(held["commentLineStrategy"]).toBe("multiline");
    expect((prose().config as UserConfig).fmt?.proseWrap).not.toBe("preserve");
  });
});
