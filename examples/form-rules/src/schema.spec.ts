import { describe, expect, it } from "vitest";

import { defaultsOf } from "@stealthscale/provider-form";

import { engine } from "#engine.ts";
import { type Signup, signup } from "#schema.ts";

const filled: Signup = {
  confirm: "hunter22hunter",
  kind: "individual",
  password: "hunter22hunter",
  username: "roy",
  vat: "",
};

describe("signup", () => {
  it("starts every control from an empty value", () => {
    expect(defaultsOf<Signup>(signup, undefined, engine)).toStrictEqual({
      confirm: "",
      kind: "",
      password: "",
      username: "",
      vat: "",
    });
  });

  it("lets an individual leave the VAT number empty", () => {
    expect(engine.validate(signup, filled)).toStrictEqual([]);
  });

  it("requires a VAT number in its format from a business", () => {
    expect(engine.validate(signup, { ...filled, kind: "business" })).toStrictEqual([
      expect.objectContaining({ keyword: "minLength", path: ["vat"] }),
    ]);
    expect(
      engine.validate(signup, { ...filled, kind: "business", vat: "NL123456789B01" }),
    ).toStrictEqual([]);
    expect(engine.validate(signup, { ...filled, kind: "business", vat: "nl" })).toStrictEqual([
      expect.objectContaining({ keyword: "format", path: ["vat"] }),
    ]);
  });

  it("requires the VAT number in the resolved schema for a business alone", () => {
    expect(engine.resolve(signup, { kind: "business" })["required"]).toContain("vat");
    expect(engine.resolve(signup, { kind: "individual" })["required"]).not.toContain("vat");
  });
});
