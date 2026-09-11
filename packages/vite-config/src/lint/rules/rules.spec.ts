import { expect, test } from "vite-plus/test";

import { type PluginRules, type Rules } from "#lint/rules/rules.ts";

test("refuses an option of the wrong type, so a rule is never configured into doing nothing", () => {
  // @ts-expect-error -- eqeqeq's option is a string, and a number is not one.
  const held: Rules = { eqeqeq: ["error", 3] };

  expect(Object.keys(held)).toHaveLength(1);
});

test("refuses a severity that is not one", () => {
  // @ts-expect-error -- the three severities are `allow`, `warn` and `deny` with their aliases.
  const held: Rules = { eqeqeq: "loud" };

  expect(Object.keys(held)).toHaveLength(1);
});

test("stays open to a name it does not know, which is what a plugin's rules arrive as", () => {
  const held: Rules = { "no-rule-by-this-name": "error" };

  expect(Object.keys(held)).toHaveLength(1);
});

test("takes a plugin's rule unchecked, there being no map to check either half against", () => {
  const held: PluginRules = { "some-plugin/some-rule": ["error", { anything: true }] };

  expect(Object.keys(held)).toHaveLength(1);
});
