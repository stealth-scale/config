import { describe, expect, it } from "vitest";

import { CASCADE } from "#rules/cascade.ts";

describe("cascade", () => {
  it("rejects a declaration marked important", () => {
    expect(CASCADE["declaration-no-important"]).toBe(true);
  });

  it("rejects a rule that never applies however it was written", () => {
    expect(CASCADE["no-descending-specificity"]).toBe(true);
    expect(CASCADE["no-duplicate-selectors"]).toBe(true);
  });
});
