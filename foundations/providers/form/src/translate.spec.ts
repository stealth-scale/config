import { describe, expect, it } from "vitest";

import { translateFrom, untranslated, worded } from "#translate.ts";

const words = translateFrom({
  "checkout.fields.email.label": "Email address",
  "errors.minLength": "Too short",
});

describe("translateFrom", () => {
  it("answers the first key the words have", () => {
    expect(
      words(["checkout.errors.email.minLength", "errors.minLength"], {
        defaultValue: "Value too short",
        minLength: 3,
      }),
    ).toBe("Too short");
    expect(words("checkout.fields.email.label", { defaultValue: "Email" })).toBe("Email address");
  });

  it("answers the default where the words have none of the keys", () => {
    expect(words("checkout.fields.name.label", { defaultValue: "Name" })).toBe("Name");
  });
});

describe("untranslated", () => {
  it("answers the default for every key", () => {
    expect(untranslated(["a", "b"], { defaultValue: "Email" })).toBe("Email");
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
