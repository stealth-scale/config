import { describe, expect, it } from "vitest";

import { tokens } from "#tokens.ts";

describe("tokens", () => {
  it("draws eleven steps of amber at the product hue", () => {
    const orange = tokens.colors?.["orange"];

    expect(Object.keys(orange ?? {})).toHaveLength(11);
    expect(JSON.stringify(orange).match(/45\.0\)/gu)).toHaveLength(11);
  });

  it("tints the grey ramp warm", () => {
    expect(JSON.stringify(tokens.colors?.["gray"]).match(/70\.0\)/gu)).toHaveLength(11);
  });
});
