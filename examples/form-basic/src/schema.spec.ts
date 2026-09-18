import { describe, expect, it } from "vitest";

import { defaultEngine, defaultsOf, standardOf } from "@stealthscale/provider-form";

import { type Contact, contact } from "#schema.ts";

describe("contact", () => {
  it("starts every control from an empty value", () => {
    expect(defaultsOf<Contact>(contact)).toStrictEqual({
      consent: false,
      email: "",
      message: "",
      name: "",
      topic: "",
    });
  });

  it("refuses the empty form on four keywords", () => {
    const issues = defaultEngine().validate(contact, defaultsOf(contact));

    expect(issues.map((issue) => [issue.path[0], issue.keyword])).toStrictEqual([
      ["consent", "const"],
      ["email", "minLength"],
      ["name", "minLength"],
      ["topic", "enum"],
    ]);
  });

  it("accepts a filled form", () => {
    const value: Contact = {
      consent: true,
      email: "roy@example.com",
      message: "",
      name: "Roy",
      topic: "sales",
    };

    expect(standardOf<Contact>(contact)["~standard"].validate(value)).toStrictEqual({ value });
  });
});
