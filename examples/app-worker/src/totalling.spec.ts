/**
 * Checks what the totalling does with a run of two, a run of one and no run at all.
 *
 * @remarks
 *   The three lengths are here because each takes a different path: the reduce
 *   only runs on the first, the seed alone answers the second, and the third never
 *   reaches either.
 */

import { describe, expect, it } from "vitest";

import { totalling } from "#totalling.ts";

describe("totalling", () => {
  it("totals a run of amounts", () => {
    const held = totalling([
      { cents: 150, currency: "EUR" },
      { cents: 275, currency: "EUR" },
    ]);

    expect(held?.cents).toBe(425);
  });

  it("totals one amount into itself", () => {
    expect(totalling([{ cents: 150, currency: "EUR" }])?.cents).toBe(150);
  });

  it("answers nothing where there was nothing to total", () => {
    expect(totalling([])).toBeUndefined();
  });

  it("refuses two currencies", () => {
    expect(() =>
      totalling([
        { cents: 1, currency: "EUR" },
        { cents: 1, currency: "GBP" },
      ]),
    ).toThrow(/cannot total/u);
  });
});
