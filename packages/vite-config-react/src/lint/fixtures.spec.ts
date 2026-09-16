/**
 * Checks which files the fixture excuse reaches and which rule it lifts.
 */

import { describe, expect, it } from "vitest";

import { fixtures } from "#lint/fixtures.ts";

/**
 * Unwraps the linter override the layer carries.
 */
function override(): { files: string[]; rules: Record<string, unknown> } {
  return fixtures().item as { files: string[]; rules: Record<string, unknown> };
}

describe("fixtures", () => {
  it("appends to the linter's overrides rather than replacing them", () => {
    expect(fixtures().at).toBe("lint.overrides");
  });

  it("excuses the two spellings a specification writes markup in and nothing else", () => {
    expect(override().files).toStrictEqual(["**/*.spec.tsx", "**/*.fixtures.tsx"]);
  });

  it("lets a specification declare more than one component and changes nothing else", () => {
    expect(override().rules).toStrictEqual({ "react/no-multi-comp": "off" });
  });

  it("names the layer for the call a consumer wrote", () => {
    expect(fixtures().name).toBe("react.lint.fixtures");
  });
});
