/**
 * Proves the staged formatting matches what the checker does not read.
 */

import { type UserConfig } from "vite-plus";
import { describe, expect, it } from "vitest";

import { formatted } from "#staged/formatted.ts";

/**
 * Reads the glob table out of a freshly built layer.
 */
function staged(): Record<string, unknown> {
  return (formatted().config as UserConfig).staged as Record<string, unknown>;
}

describe("formatted", () => {
  it("formats and does no more", () => {
    expect(Object.values(staged())).toStrictEqual(["vp fmt"]);
  });

  it("matches what the formatter reads and the linter does not", () => {
    const [glob] = Object.keys(staged());

    expect(glob).toContain("md");
    expect(glob).toContain("css");
    expect(glob).not.toContain("tsx");
  });

  it("names the layer so a repository can remove it", () => {
    expect(formatted().name).toBe("staged.formatted");
  });
});
