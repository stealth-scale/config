import { describe, expect, it } from "vitest";

import { engine, matches, vatNumber } from "#engine.ts";

describe("vatNumber", () => {
  it.each([
    { value: "NL123456789B01", want: true },
    { value: "DE123456789", want: true },
    { value: "", want: true },
    { value: "nl123456789b01", want: false },
    { value: "NL12", want: false },
  ])("answers $want for $value", ({ value, want }) => {
    expect(vatNumber.holds(value)).toBe(want);
  });
});

describe("matches", () => {
  it("accepts a value equal to the property it names", () => {
    expect(matches.holds("password", "hunter22", { password: "hunter22" })).toBe(true);
    expect(matches.holds("password", "hunter22", { password: "other" })).toBe(false);
  });

  it("refuses where the parameter or the values are not what it reads", () => {
    expect(matches.holds(3, "a", { password: "a" })).toBe(false);
    expect(matches.holds("password", "a", null)).toBe(false);
  });
});

describe("engine", () => {
  it("refuses a VAT number under the format keyword", () => {
    expect(engine.validate({ format: "vat-number", type: "string" }, "nl")).toStrictEqual([
      expect.objectContaining({ keyword: "format", values: { format: "vat-number" } }),
    ]);
  });

  it("refuses a confirmation that differs under the keyword's own name", () => {
    const schema = {
      properties: { confirm: { type: "string", "x-matches": "password" } },
      type: "object",
    };

    expect(engine.validate(schema, { confirm: "a", password: "b" })).toStrictEqual([
      expect.objectContaining({ keyword: "x-matches", path: ["confirm"] }),
    ]);
    expect(engine.validate(schema, { confirm: "b", password: "b" })).toStrictEqual([]);
  });
});
