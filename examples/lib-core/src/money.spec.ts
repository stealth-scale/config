import { expect, test } from "vite-plus/test";

import { added } from "#money.ts";

test("totals two amounts of the same currency", () => {
  expect(added({ cents: 150, currency: "EUR" }, { cents: 275, currency: "EUR" })).toEqual({
    cents: 425,
    currency: "EUR",
  });
});

test("takes what is owed as a negative amount", () => {
  expect(added({ cents: 150, currency: "EUR" }, { cents: -200, currency: "EUR" }).cents).toBe(-50);
});

test("refuses to total two currencies, nothing here knowing what one is worth in the other", () => {
  expect(() => added({ cents: 1, currency: "EUR" }, { cents: 1, currency: "GBP" })).toThrow(
    /cannot total EUR and GBP/u,
  );
});
