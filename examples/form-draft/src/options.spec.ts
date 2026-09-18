import { describe, expect, it } from "vitest";

import { nothing, profileOptions } from "#options.ts";

describe("profileOptions", () => {
  it("starts from the schema's defaults and validates with the schema", () => {
    expect(profileOptions.defaultValues).toStrictEqual({
      bio: "",
      email: "",
      name: "",
      newPassword: "",
    });
    expect(profileOptions.validators.onDynamic["~standard"].vendor).toBe("stealthscale");
    expect(profileOptions.validationLogic).toBeTypeOf("function");
  });
});

describe("nothing", () => {
  it("does nothing", () => {
    expect(() => {
      nothing();
    }).not.toThrow();
  });
});
