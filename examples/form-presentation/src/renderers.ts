/**
 * Registers the renderers the checkout form is drawn with: one per type, one per format or
 * constraint that draws better than the type alone, and one a field names by `control`.
 */

import { byControl, RANK, type Renderer } from "@stealthscale/provider-form";

import { Amount } from "#controls/amount.tsx";
import { Choice } from "#controls/choice.tsx";
import { Email } from "#controls/email.tsx";
import { PlainNumber } from "#controls/plain-number.tsx";
import { PlainText } from "#controls/plain-text.tsx";
import { Textarea } from "#controls/textarea.tsx";

/**
 * Lists the renderers in registration order. The later of two renderers ranking the same is
 * picked, so a package overrides a default by registering after it.
 */
export const renderers: readonly Renderer[] = [
  { draw: PlainText, suits: (_, schema) => (schema["type"] === "string" ? RANK.type : undefined) },
  {
    draw: PlainNumber,
    suits: (_, schema) => (schema["type"] === "number" ? RANK.type : undefined),
  },
  {
    draw: Email,
    suits: (presentation, schema) =>
      presentation.control === "email"
        ? RANK.control
        : schema["format"] === "email"
          ? RANK.format
          : undefined,
  },
  {
    draw: Choice,
    suits: (_, schema) => (Array.isArray(schema["enum"]) ? RANK.constraint : undefined),
  },
  {
    draw: Amount,
    suits: (presentation, schema) =>
      schema["type"] === "number" && presentation.options?.["currency"] !== undefined
        ? RANK.constraint
        : undefined,
  },
  { draw: Textarea, suits: byControl("textarea") },
];
