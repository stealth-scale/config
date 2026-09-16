import { describe, expect, it } from "vitest";

import { type PluginRules, type Rules } from "#lint/rules/rules.ts";

describe("rules", () => {
  it("refuses an option of the wrong type", () => {
    // @ts-expect-error -- eqeqeq's option is a string, and a number is not one.
    const held: Rules = { eqeqeq: ["error", 3] };

    expect(Object.keys(held)).toHaveLength(1);
  });

  it("refuses a value that is not a severity", () => {
    // @ts-expect-error -- the three severities are `allow`, `warn` and `deny` with their aliases.
    const held: Rules = { eqeqeq: "loud" };

    expect(Object.keys(held)).toHaveLength(1);
  });

  it("stays open to a name it does not know", () => {
    const held: Rules = { "no-rule-by-this-name": "error" };

    expect(Object.keys(held)).toHaveLength(1);
  });

  it("accepts a plugin rule name unchecked", () => {
    const held: PluginRules = { "some-plugin/some-rule": ["error", { anything: true }] };

    expect(Object.keys(held)).toHaveLength(1);
  });
});
