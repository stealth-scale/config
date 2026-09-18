import { describe, expect, it } from "vitest";

import { apart } from "#apart.ts";
import { type Signup } from "#schema.ts";

/**
 * Builds the values the form starts from.
 */
function blank(): Signup {
  return { confirm: "", kind: "", password: "", username: "", vat: "" };
}

describe("apart", () => {
  it("marks the password where it contains the username", () => {
    expect(apart({ value: { ...blank(), password: "ann12345", username: "ann" } })).toStrictEqual({
      fields: { password: { keyword: "containsUsername" } },
    });
  });

  it("passes a password that does not contain the username", () => {
    expect(apart({ value: { ...blank(), password: "hunter22", username: "ann" } })).toBeUndefined();
    expect(apart({ value: blank() })).toBeUndefined();
  });
});
