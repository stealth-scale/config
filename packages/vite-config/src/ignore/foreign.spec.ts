/**
 * Proves the foreign globs name every tree a tool should walk past.
 */

import { describe, expect, it } from "vitest";

import { FOREIGN } from "#ignore/foreign.ts";

describe("foreign", () => {
  it("names the installed built reported and bookkeeping directories", () => {
    expect(FOREIGN).toStrictEqual([
      "**/node_modules/**",
      "**/.git/**",
      "**/.claude/**",
      "**/dist/**",
      "**/coverage/**",
    ]);
  });

  it("keeps the two directories a runner already walks past", () => {
    expect(FOREIGN).toContain("**/node_modules/**");
    expect(FOREIGN).toContain("**/.git/**");
  });

  it("walks past a worktree an agent session checked out", () => {
    expect(FOREIGN).toContain("**/.claude/**");
  });
});
