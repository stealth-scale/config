import { describe, expect, it } from "vitest";

import { catalogue } from "#catalogue.ts";
import { type Presentation } from "#presentation.ts";
import { type Schema } from "#schema.ts";

const checkout: Schema = {
  properties: {
    billing: {
      properties: { vat: { description: "As on the invoice", minLength: 3, type: "string" } },
      required: ["vat"],
      type: "object",
    },
    kind: { enum: ["business", "individual"] },
    lines: { items: { properties: { amount: { minimum: 1, type: "number" } } }, type: "array" },
    name: { title: "Full name", type: "string" },
  },
  type: "object",
};

const presentation: Presentation = {
  id: "checkout",
  steps: {
    of: [
      { name: "who", of: ["name", "kind"] },
      { name: "billing", of: [{ legend: true, name: "address", of: ["billing.vat"] }] },
    ],
  },
};

describe("catalogue", () => {
  it("lists a label for every property with the schema's title or the path written out", () => {
    const ids = catalogue(checkout, presentation).filter((entry) => entry.id.endsWith(".label"));

    expect(ids).toStrictEqual([
      { english: "Billing", id: "checkout.fields.billing.label" },
      { english: "Vat", id: "checkout.fields.billing.vat.label" },
      { english: "Kind", id: "checkout.fields.kind.label" },
      { english: "Lines", id: "checkout.fields.lines.label" },
      { english: "Amount", id: "checkout.fields.lines[].amount.label" },
      { english: "Full name", id: "checkout.fields.name.label" },
      { english: "Who", id: "checkout.steps.who.label" },
      { english: "Billing", id: "checkout.steps.billing.label" },
    ]);
  });

  it("lists the help text and the choices and the keywords that can fail", () => {
    const entries = catalogue(checkout, presentation);

    expect(entries).toContainEqual({
      english: "As on the invoice",
      id: "checkout.fields.billing.vat.description",
    });
    expect(entries).toContainEqual({
      english: "business",
      id: "checkout.fields.kind.options.business",
    });
    expect(entries).toContainEqual({ english: "", id: "checkout.errors.billing.vat.minLength" });
    expect(entries).toContainEqual({ english: "", id: "checkout.errors.lines[].amount.minimum" });
    expect(entries).toContainEqual({ english: "", id: "checkout.errors.billing.vat.required" });
  });

  it("lists a legend for a group drawing a fieldset", () => {
    expect(catalogue(checkout, presentation)).toContainEqual({
      english: "Address",
      id: "checkout.groups.address.legend",
    });
  });

  it("lists a legend for a group in the members of a form without steps", () => {
    const flat: Presentation = {
      id: "p",
      of: [{ legend: true, name: "who", of: ["name", { of: ["kind"] }] }],
    };

    expect(catalogue(checkout, flat)).toContainEqual({ english: "Who", id: "p.groups.who.legend" });
  });

  it("ignores a required entry that is not a name", () => {
    const odd: Schema = { properties: { a: { type: "string" } }, required: ["a", 3] };

    expect(
      catalogue(odd, { id: "p" }).filter((entry) => entry.id.endsWith(".required")),
    ).toStrictEqual([{ english: "", id: "p.errors.a.required" }]);
  });

  it("lists each message once when two branches declare a property", () => {
    const twice: Schema = {
      anyOf: [{ properties: { a: { type: "string" } } }, { properties: { a: { type: "string" } } }],
    };

    expect(
      catalogue(twice, { id: "p" }).filter((entry) => entry.id.endsWith(".label")),
    ).toHaveLength(1);
  });
});
