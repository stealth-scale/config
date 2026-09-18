import { describe, expect, it } from "vitest";

import { rendererFor } from "@stealthscale/provider-form";

import { Amount } from "#controls/amount.tsx";
import { Textarea } from "#controls/textarea.tsx";
import { renderers } from "#renderers.ts";

describe("renderers", () => {
  it.each([
    { draw: Amount, presentation: { options: { currency: "EUR" } }, schema: { type: "number" } },
    { draw: Textarea, presentation: { control: "textarea" }, schema: { type: "string" } },
  ])("picks $draw.name for $schema and $presentation", ({ draw, presentation, schema }) => {
    expect(rendererFor(renderers, presentation, schema)?.draw).toBe(draw);
  });

  it("picks nothing for a field the field library draws", () => {
    expect(rendererFor(renderers, {}, { type: "number" })).toBeUndefined();
    expect(rendererFor(renderers, {}, { type: "string" })).toBeUndefined();
  });
});
