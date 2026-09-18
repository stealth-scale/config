/**
 * States what the checkout form collects and how it is drawn, in one JSON Schema document, and
 * reads the presentation out of it once.
 */

import {
  defaultEngine,
  type Presentation,
  presentationOf,
  type Schema,
  unplaced,
  validatePresentation,
} from "@stealthscale/provider-form";

/**
 * The schema the checkout form is generated from, with how it is drawn written beside the data.
 *
 * @remarks
 *   The root's `x-form` states the members in order: three fieldsets and a lone field. A member
 *   the schema declares only under a condition, `vat` under `then`, is listed with the others and
 *   drawn where the resolved schema has it. A property no member names, `reference`, is reported
 *   rather than drawn. Per-field keywords name a control, a span in a grid, and the options a
 *   renderer reads. The email box needs no keyword, because the field library draws a string
 *   with `format: "email"` as one.
 */
export const checkout: Schema = {
  allOf: [
    {
      if: { properties: { kind: { const: "business" } }, required: ["kind"] },
      // eslint-disable-next-line unicorn/no-thenable -- then is the JSON Schema keyword, and no promise reads it
      then: { properties: { vat: { minLength: 1, type: "string" } }, required: ["vat"] },
    },
  ],
  properties: {
    billing: {
      properties: {
        city: { minLength: 1, type: "string", "x-span": 2 },
        country: { enum: ["BE", "NL"], type: "string" },
        line1: { minLength: 1, title: "Address", type: "string" },
        postcode: { minLength: 1, type: "string" },
      },
      required: ["city", "country", "line1", "postcode"],
      type: "object",
    },
    email: { format: "email", minLength: 1, type: "string" },
    kind: { enum: ["business", "individual"], type: "string" },
    lines: {
      items: {
        properties: {
          amount: { minimum: 1, type: "number", "x-options": { currency: "EUR" } },
          description: { minLength: 1, type: "string" },
        },
        required: ["amount", "description"],
        type: "object",
      },
      minItems: 1,
      type: "array",
    },
    name: { minLength: 2, title: "Full name", type: "string" },
    notes: { maxLength: 100, type: "string", "x-control": "textarea" },
    reference: { type: "string" },
  },
  required: ["billing", "email", "kind", "lines", "name"],
  type: "object",
  "x-form": {
    id: "checkout",
    of: [
      { legend: true, name: "who", of: ["name", "email", "kind", "vat"] },
      {
        legend: true,
        name: "billing",
        of: [
          "billing.line1",
          { columns: 3, of: ["billing.postcode", "billing.city"] },
          "billing.country",
        ],
      },
      {
        legend: true,
        name: "line",
        of: [{ direction: "row", of: ["lines[].description", "lines[].amount"] }],
        repeat: "lines",
      },
      "notes",
    ],
  },
};

/**
 * The paths of every property any branch of the schema can produce.
 */
const paths = defaultEngine().paths(checkout);

/**
 * How the checkout form is drawn, read out of the schema's own keywords and checked against the
 * paths the schema has, so a member naming a path the schema lacks throws here rather than
 * drawing nothing.
 */
export const presentation: Presentation = presentationOf(checkout);

validatePresentation(presentation, paths);

/**
 * The fields the schema states and no member draws.
 */
export const unplacedFields: readonly string[] = unplaced(presentation, paths);
