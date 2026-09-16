/**
 * Covers the contribution an application extends its tier with.
 */

import { describe, expect, it } from "vitest";

import { stylesheet } from "#stylesheet.ts";

describe("stylesheet", () => {
  it("appends to the list of plugins rather than replacing whatever else is there", () => {
    expect(stylesheet().at).toBe("plugins");
  });

  it("names the layer for the call a consumer wrote", () => {
    expect(stylesheet().name).toBe("theme.stylesheet");
  });

  it("carries the stylesheet plugin under its house name", () => {
    expect(stylesheet().item).toMatchObject({ enforce: "pre", name: "stealth:theme.stylesheet" });
  });

  it("builds a plugin instance per call", () => {
    expect(stylesheet().item).not.toBe(stylesheet().item);
  });

  it("passes the repository's own options through to the plugin", () => {
    expect(() => stylesheet({ include: ["app/**/*.tsx"] })).not.toThrow();
  });
});
