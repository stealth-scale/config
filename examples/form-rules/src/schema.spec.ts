import { describe, expect, it } from "vitest";

import { defaultsOf } from "@stealthscale/provider-form";

import { engine } from "#engine.ts";
import { type Signup, signup } from "#schema.ts";

const filled: Signup = {
  confirm: "hunter22hunter",
  kind: "individual",
  password: "hunter22hunter",
  username: "roy",
};

describe("signup", () => {
  it("starts every control from an empty value with no VAT number", () => {
    expect(defaultsOf<Signup>(signup, undefined, engine)).toStrictEqual({
      confirm: "",
      kind: "",
      password: "",
      username: "",
    });
  });

  it("accepts an individual without a VAT number", () => {
    expect(engine.validate(signup, filled)).toStrictEqual([]);
  });

  it("requires a VAT number in its format from a business", () => {
    expect(engine.validate(signup, { ...filled, kind: "business" })).toStrictEqual([
      expect.objectContaining({ keyword: "required", path: ["vat"] }),
    ]);
    expect(
      engine.validate(signup, { ...filled, kind: "business", vat: "NL123456789B01" }),
    ).toStrictEqual([]);
    expect(engine.validate(signup, { ...filled, kind: "business", vat: "nl" })).toStrictEqual([
      expect.objectContaining({ keyword: "format", path: ["vat"] }),
    ]);
  });

  it("declares the VAT number in the resolved schema for a business alone", () => {
    expect(engine.resolve(signup, { kind: "business" })["properties"]).toHaveProperty("vat");
    expect(engine.resolve(signup, { kind: "individual" })["properties"]).not.toHaveProperty("vat");
  });
});
