import { describe, expect, it } from "vitest";

import { added } from "#money.ts";

describe("money", () => {
  it("totals two amounts of the same currency", () => {
    expect(added({ cents: 150, currency: "EUR" }, { cents: 275, currency: "EUR" })).toStrictEqual({
      cents: 425,
      currency: "EUR",
    });
  });

  it("takes what is owed as a negative amount", () => {
    expect(added({ cents: 150, currency: "EUR" }, { cents: -200, currency: "EUR" }).cents).toBe(
      -50,
    );
  });

  it("refuses to total two currencies", () => {
    expect(() => added({ cents: 1, currency: "EUR" }, { cents: 1, currency: "GBP" })).toThrow(
      /cannot total EUR and GBP/u,
    );
  });
});
