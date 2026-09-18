import { describe, expect, it } from "vitest";

import { rendererFor } from "@stealthscale/provider-form";

import { Amount } from "#controls/amount.tsx";
import { Choice } from "#controls/choice.tsx";
import { Email } from "#controls/email.tsx";
import { PlainNumber } from "#controls/plain-number.tsx";
import { PlainText } from "#controls/plain-text.tsx";
import { Textarea } from "#controls/textarea.tsx";
import { renderers } from "#renderers.ts";

describe("renderers", () => {
  it.each([
    { draw: PlainText, presentation: {}, schema: { type: "string" } },
    { draw: PlainNumber, presentation: {}, schema: { type: "number" } },
    { draw: Email, presentation: {}, schema: { format: "email", type: "string" } },
    { draw: Email, presentation: { control: "email" }, schema: { type: "string" } },
    { draw: Choice, presentation: {}, schema: { enum: ["a"], type: "string" } },
    { draw: Amount, presentation: { options: { currency: "EUR" } }, schema: { type: "number" } },
    { draw: Textarea, presentation: { control: "textarea" }, schema: { type: "string" } },
  ])("picks $draw.name for $schema and $presentation", ({ draw, presentation, schema }) => {
    expect(rendererFor(renderers, presentation, schema)?.draw).toBe(draw);
  });

  it("picks nothing for a type no renderer suits", () => {
    expect(rendererFor(renderers, {}, { type: "boolean" })).toBeUndefined();
  });
});
