import { describe, expect, it } from "vitest";

import { tally } from "#totals.ts";

describe("totals", () => {
  it("totals every amount it was given", () => {
    expect(tally(["150EUR", "275EUR"])).toBe("425EUR");
  });

  it("totals one amount into itself", () => {
    expect(tally(["150EUR"])).toBe("150EUR");
  });

  it("reads what is owed as a negative amount", () => {
    expect(tally(["150EUR", "-200EUR"])).toBe("-50EUR");
  });

  it("refuses an argument whose amount is not a number", () => {
    expect(() => tally(["manyEUR"])).toThrow(/cannot read manyEUR/u);
  });

  it("refuses an argument whose currency is not one", () => {
    expect(() => tally(["150eur"])).toThrow(/cannot read 150eur/u);
  });

  it("refuses two currencies", () => {
    expect(() => tally(["1EUR", "1GBP"])).toThrow(/cannot total/u);
  });

  it("refuses to total nothing and says what to pass instead", () => {
    expect(() => tally([])).toThrow(/given nothing to total/u);
  });
});
