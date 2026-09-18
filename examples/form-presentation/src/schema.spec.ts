import { describe, expect, it } from "vitest";

import { catalogue, defaultEngine, validatePresentation } from "@stealthscale/provider-form";

import { checkout, presentation, unplacedFields } from "#schema.ts";

describe("presentation", () => {
  it("reads the identifier and the members from the root keyword", () => {
    expect(presentation.id).toBe("checkout");
    expect(
      presentation.of?.map((member) => (typeof member === "string" ? member : member.name)),
    ).toStrictEqual(["who", "billing", "line", "notes"]);
  });

  it("reads each field's settings from the property's keywords", () => {
    expect(presentation.fields).toStrictEqual({
      "billing.city": { span: 2 },
      "lines[].amount": { options: { currency: "EUR" } },
      notes: { control: "textarea" },
    });
  });

  it("reports the property no member draws", () => {
    expect(unplacedFields).toStrictEqual(["reference"]);
  });

  it("refuses a member naming a path the schema lacks", () => {
    expect(() => {
      validatePresentation({ id: "checkout", of: ["nmae"] }, defaultEngine().paths(checkout));
    }).toThrow(/"nmae"/u);
  });

  it("lists every message the form reads with the schema's own English", () => {
    const entries = catalogue(checkout, presentation);

    expect(entries).toContainEqual({ english: "Full name", id: "checkout.fields.name.label" });
    expect(entries).toContainEqual({ english: "Line", id: "checkout.groups.line.legend" });
    expect(entries).toContainEqual({ english: "", id: "checkout.errors.lines[].amount.minimum" });
  });
});
