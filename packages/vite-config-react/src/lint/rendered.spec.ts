/**
 * Checks which files the docblock excuse reaches and which rules it turns off.
 */

import { describe, expect, it } from "vitest";

import { rendered } from "#lint/rendered.ts";

/**
 * Unwraps the linter override the layer carries.
 */
function override(): { files: string[]; rules: Record<string, unknown> } {
  return rendered().item as { files: string[]; rules: Record<string, unknown> };
}

describe("rendered", () => {
  it("appends to the linter's overrides rather than replacing them", () => {
    expect(rendered().at).toBe("lint.overrides");
  });

  it("excuses the two spellings a specification writes markup in and nothing else", () => {
    expect(override().files).toStrictEqual(["**/*.spec.tsx", "**/*.fixtures.tsx"]);
  });

  it("turns the docblock rules off", () => {
    expect(override().rules["jsdoc-js/require-jsdoc"]).toBe("off");
    expect(override().rules["jsdoc-js/match-description"]).toBe("off");
  });

  it("names the layer for the call a consumer wrote", () => {
    expect(rendered().name).toBe("react.lint.rendered");
  });
});
