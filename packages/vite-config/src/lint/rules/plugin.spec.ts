/**
 * Specifies the plugin list the rule groups are written against.
 */

import { describe, expect, it } from "vitest";

import { PLUGINS } from "#lint/rules/plugin.ts";

describe("plugin", () => {
  it("names only plugins the linter already ships", () => {
    expect(PLUGINS).toStrictEqual(["typescript", "unicorn", "oxc", "import", "promise"]);
  });
});
