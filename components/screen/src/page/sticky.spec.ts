import { describe, expect, it } from "vitest";

import { stuck } from "#page/sticky.ts";

describe("stuck", () => {
  it("writes the attribute for a band that stays put", () => {
    expect(stuck(true)).toBe("");
  });

  it("writes nothing for a band that moves with the page", () => {
    expect(stuck(false)).toBeUndefined();
  });

  it("writes nothing where a caller states nothing", () => {
    expect(stuck()).toBeUndefined();
  });
});
