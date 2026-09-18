import { describe, expect, it } from "vitest";

import { FRAGMENTS, ID } from "#options.ts";

describe("options", () => {
  it("names the index under a scheme no installed package can carry", () => {
    expect(ID).toBe("virtual:specimen-index");
  });

  it("ends the fragments specifier with a separator so a page identifier appends to it", () => {
    expect(FRAGMENTS.endsWith("/")).toBe(true);
  });

  it("keeps the two specifiers apart so neither claims the other", () => {
    expect(FRAGMENTS.startsWith(ID)).toBe(false);
  });
});
