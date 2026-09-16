/**
 * Specifies the console calls that stay and the pedantic rule that does not.
 */

import { describe, expect, it } from "vitest";

import { CATEGORIES } from "#lint/rules/category.ts";
import { SAFETY } from "#lint/rules/safety.ts";

describe("safety", () => {
  it("keeps the two streams a failure is reported on", () => {
    expect(SAFETY["no-console"]).toStrictEqual(["error", { allow: ["error", "warn"] }]);
  });

  it("turns off the rule inside `pedantic` that would bury every real finding", () => {
    expect(CATEGORIES.pedantic).toBe("error");
    expect(SAFETY["typescript/prefer-readonly-parameter-types"]).toBe("off");
  });
});
