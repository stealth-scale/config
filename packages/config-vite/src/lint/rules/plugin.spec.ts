import { expect, test } from "vite-plus/test";

import { PLUGINS } from "#lint/rules/plugin.ts";

test("names only plugins the linter already carries, since an absent one runs no rule", () => {
  expect(PLUGINS).toEqual(["typescript", "unicorn", "oxc", "import", "promise"]);
});
