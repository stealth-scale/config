/**
 * Covers the layer the check produces: where it lands, what it is called, and
 * what a repository's own options do to it.
 */

import { describe, expect, it } from "vitest";

import { check } from "#plugin/check.ts";

describe("check", () => {
  it("appends to the list of plugins rather than replacing whatever else is there", () => {
    expect(check().at).toBe("plugins");
  });

  it("names the layer for the call a consumer wrote", () => {
    expect(check().name).toBe("css.check");
  });

  it("gives a reason the type checker cannot supply", () => {
    expect(check().because).toContain("type checker");
  });

  it("adds a plugin for the bundler to run", () => {
    expect(check().item).toBeDefined();
  });

  it("checks the extra globs a repository names", () => {
    expect(() => check({ also: ["**/*.module.css"] })).not.toThrow();
    expect(check({ also: ["**/*.module.css"] }).item).toBeDefined();
  });

  it("leaves the globs a repository names untouched", () => {
    expect(check({ except: ["vendor/**"] }).item).toBeDefined();
  });
});
