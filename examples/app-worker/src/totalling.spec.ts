import { expect, test } from "vite-plus/test";

import { totalling } from "#totalling.ts";

test("totals a run of amounts", () => {
  const held = totalling([
    { cents: 150, currency: "EUR" },
    { cents: 275, currency: "EUR" },
  ]);

  expect(held?.cents).toBe(425);
});

test("totals one amount into itself", () => {
  expect(totalling([{ cents: 150, currency: "EUR" }])?.cents).toBe(150);
});

test("answers nothing where there was nothing to total", () => {
  expect(totalling([])).toBeUndefined();
});

test("refuses two currencies, which the library it calls has no total for", () => {
  expect(() =>
    totalling([
      { cents: 1, currency: "EUR" },
      { cents: 1, currency: "GBP" },
    ]),
  ).toThrow(/cannot total/u);
});
