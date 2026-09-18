import { describe, expect, it } from "vitest";

import { defaultsOf, sensitivePaths } from "@stealthscale/provider-form";

import { profile, STEPS } from "#schema.ts";

describe("profile", () => {
  it("starts from the saved values written over the schema's defaults", () => {
    expect(defaultsOf(profile, { email: "roy@example.com", name: "Roy" })).toStrictEqual({
      bio: "",
      email: "roy@example.com",
      name: "Roy",
      newPassword: "",
    });
  });

  it("marks the password as a value a draft never keeps", () => {
    expect(sensitivePaths(profile)).toStrictEqual(["newPassword"]);
  });

  it("draws every property in one of the two steps", () => {
    expect([...STEPS.who, ...STEPS.about].toSorted()).toStrictEqual(
      Object.keys(profile["properties"] as object).toSorted(),
    );
  });
});
