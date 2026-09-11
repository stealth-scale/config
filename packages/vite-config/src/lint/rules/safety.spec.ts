import { expect, test } from "vite-plus/test";

import { CATEGORIES } from "#lint/rules/category.ts";
import { SAFETY } from "#lint/rules/safety.ts";

test("keeps the two streams a failure is reported on", () => {
  expect(SAFETY["no-console"]).toEqual(["error", { allow: ["error", "warn"] }]);
});

test("turns off the rule inside `pedantic` that would bury every real finding", () => {
  if (CATEGORIES.pedantic === "error") {
    expect(SAFETY["typescript/prefer-readonly-parameter-types"]).toBe("off");
  }
});
