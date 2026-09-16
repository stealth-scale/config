/**
 * Covers the contribution the system package extends its tier with.
 */

import { describe, expect, it } from "vitest";

import { runtime } from "#runtime.ts";

describe("runtime", () => {
  it("appends to the list of plugins rather than replacing whatever else is there", () => {
    expect(runtime().at).toBe("plugins");
  });

  it("names the layer for the call a consumer wrote", () => {
    expect(runtime().name).toBe("theme.runtime");
  });

  it("carries the runtime plugin under its house name", () => {
    expect(runtime().item).toMatchObject({ name: "stealth:theme.runtime" });
  });

  it("builds a plugin instance per call", () => {
    expect(runtime().item).not.toBe(runtime().item);
  });

  it("passes the repository's own options through to the plugin", () => {
    expect(() => runtime({ systemPackage: "@acme/design" })).not.toThrow();
  });
});
