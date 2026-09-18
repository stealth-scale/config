import { describe, expect, it } from "vitest";

import { rendererFor } from "@stealthscale/provider-form";

import { CheckboxField } from "#checkbox.tsx";
import { NumberField } from "#number.tsx";
import { renderers } from "#renderers.ts";
import { SelectField } from "#select.tsx";
import { TextField } from "#text.tsx";

describe("renderers", () => {
  it.each([
    { schema: { type: "string" }, want: TextField },
    { schema: { type: "number" }, want: NumberField },
    { schema: { type: "integer" }, want: NumberField },
    { schema: { type: "boolean" }, want: CheckboxField },
    { schema: { enum: ["a", "b"], type: "string" }, want: SelectField },
  ])("draws $schema with $want.name", ({ schema, want }) => {
    expect(rendererFor(renderers, {}, schema)?.draw).toBe(want);
  });

  it("draws nothing for a type no renderer suits", () => {
    expect(rendererFor(renderers, {}, { type: "array" })).toBeUndefined();
  });
});
