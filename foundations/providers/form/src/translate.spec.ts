import { describe, expect, it } from "vitest";

import { interpolate, translateFrom, untranslated, worded } from "#translate.ts";

const words = translateFrom({
  "checkout.fields.email.label": "Email address",
  "errors.minLength": "At least {{minLength}} characters",
});

describe("interpolate", () => {
  it("writes a string and a number into the placeholders", () => {
    expect(interpolate("{{name}} is {{age}}", { age: 3, name: "Roy" })).toBe("Roy is 3");
  });

  it("writes nothing for a value that is neither and for a value that is absent", () => {
    expect(interpolate("{{a}}|{{b}}", { a: { x: 1 } })).toBe("|");
  });
});

describe("translateFrom", () => {
  it("returns the first key the words have with the values written in", () => {
    expect(
      words(["checkout.errors.email.minLength", "errors.minLength"], {
        defaultValue: "Value too short",
        minLength: 3,
      }),
    ).toBe("At least 3 characters");
    expect(words("checkout.fields.email.label", { defaultValue: "Email" })).toBe("Email address");
  });

  it("returns the default with the values written in where the words have none of the keys", () => {
    expect(words("checkout.fields.name.label", { defaultValue: "Name" })).toBe("Name");
    expect(words("checkout.sent", { defaultValue: "Thanks {{name}}", name: "Roy" })).toBe(
      "Thanks Roy",
    );
  });
});

describe("untranslated", () => {
  it("returns the default for every key with the values written in", () => {
    expect(untranslated(["a", "b"], { defaultValue: "Email" })).toBe("Email");
    expect(untranslated("a", { defaultValue: "Hi {{name}}", name: "Roy" })).toBe("Hi Roy");
  });
});

describe("worded", () => {
  it.each([
    { path: "billing.vat", want: "Vat" },
    { path: "billing.vatNumber", want: "Vat number" },
    { path: "lines[].amount", want: "Amount" },
    { path: "lines[2]", want: "Lines" },
    { path: "email", want: "Email" },
    { path: "", want: "" },
  ])("writes $path as $want", ({ path, want }) => {
    expect(worded(path)).toBe(want);
  });
});
