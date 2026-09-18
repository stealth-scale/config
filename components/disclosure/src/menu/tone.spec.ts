import { describe, expect, expectTypeOf, it } from "vitest";

import { type Tone } from "#menu/tone.ts";

describe("Tone", () => {
  it("names the one purpose a menu draws a row differently for", () => {
    expectTypeOf<Tone>().toEqualTypeOf<"critical">();

    expect(true).toBe(true);
  });

  it("refuses a purpose the recipe states no styles for", () => {
    expectTypeOf<"positive">().not.toExtend<Tone>();

    expect(true).toBe(true);
  });
});
