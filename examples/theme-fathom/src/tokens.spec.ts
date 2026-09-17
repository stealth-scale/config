import { describe, expect, it } from "vitest";

import { tokens } from "#tokens.ts";

describe("tokens", () => {
  it("draws eleven steps of teal at the product hue", () => {
    const teal = tokens.colors?.["teal"];

    expect(Object.keys(teal ?? {})).toHaveLength(11);
    expect(JSON.stringify(teal).match(/185\.0\)/gu)).toHaveLength(11);
  });

  it("tints the grey ramp towards the neutral hue", () => {
    expect(JSON.stringify(tokens.colors?.["gray"]).match(/200\.0\)/gu)).toHaveLength(11);
  });
});
