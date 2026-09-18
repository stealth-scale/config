import { describe, expect, it } from "vitest";

import { catalogued } from "#catalogued.ts";

describe("catalogued", () => {
  it("appends to plugins rather than replacing them", () => {
    expect(catalogued().at).toBe("plugins");
  });

  it("names the layer for the call a consumer wrote", () => {
    expect(catalogued().name).toBe("i18n.catalogued");
  });

  it("carries the plugin under its house name", () => {
    expect(catalogued().item).toMatchObject({ name: "stealth:i18n" });
  });

  it("builds a plugin instance per call", () => {
    expect(catalogued().item).not.toBe(catalogued().item);
  });

  it("passes the options through to the plugin", () => {
    expect(() => catalogued({ fallback: "nl" })).not.toThrow();
  });

  it("states why the plugin is there", () => {
    expect(catalogued().because).toContain("catalogue");
  });
});
