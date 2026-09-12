import { expect, test } from "vite-plus/test";

import { rendered } from "#lint/rendered.ts";

/**
 * Reads back the override the contribution carries.
 *
 * @returns The paths it applies to, against the rules it changes for them.
 */
function override(): { files: string[]; rules: Record<string, unknown> } {
  return rendered().item as { files: string[]; rules: Record<string, unknown> };
}

test("appends to the linter's overrides rather than replacing them", () => {
  expect(rendered().at).toBe("lint.overrides");
});

test("excuses the two spellings a specification writes markup in, and nothing else", () => {
  expect(override().files).toEqual(["**/*.spec.tsx", "**/*.fixtures.tsx"]);
});

test("turns the docblock rules off, which is what the plain spelling is already excused", () => {
  expect(override().rules["jsdoc-js/require-jsdoc"]).toBe("off");
  expect(override().rules["jsdoc-js/match-description"]).toBe("off");
});

test("names itself, so a repository holding its scenes to the standard can take it back", () => {
  expect(rendered().name).toContain("lint.relax");
});
