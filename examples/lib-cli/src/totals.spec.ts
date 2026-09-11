import { expect, test } from "vite-plus/test";

import { tally } from "#totals.ts";

test("totals every amount it was given", () => {
  expect(tally(["150EUR", "275EUR"])).toBe("425EUR");
});

test("totals one amount into itself", () => {
  expect(tally(["150EUR"])).toBe("150EUR");
});

test("reads what is owed as a negative amount", () => {
  expect(tally(["150EUR", "-200EUR"])).toBe("-50EUR");
});

test("refuses an argument whose amount is not a number", () => {
  expect(() => tally(["manyEUR"])).toThrow(/cannot read manyEUR/u);
});

test("refuses an argument whose currency is not one", () => {
  expect(() => tally(["150eur"])).toThrow(/cannot read 150eur/u);
});

test("refuses two currencies, which the library it calls has no total for", () => {
  expect(() => tally(["1EUR", "1GBP"])).toThrow(/cannot total/u);
});

test("refuses to total nothing, and says what to pass instead", () => {
  expect(() => tally([])).toThrow(/given nothing to total/u);
});
