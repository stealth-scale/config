import { expect, test } from "vite-plus/test";

import { CASCADE } from "#rules/cascade.ts";

test("refuses a declaration that wins over the cascade instead of taking part in it", () => {
  expect(CASCADE["declaration-no-important"]).toBe(true);
});

test("refuses a rule that never applies, whether written that way or arrived at", () => {
  expect(CASCADE["no-descending-specificity"]).toBe(true);
  expect(CASCADE["no-duplicate-selectors"]).toBe(true);
});
