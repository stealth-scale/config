/**
 * Registers the renderers this page adds to the field library's own: a number with a currency
 * beside it, and a multi-line box a field names by `control`.
 */

import { byControl, RANK, type Renderer } from "@stealthscale/provider-form";

import { Amount } from "#controls/amount.tsx";
import { Textarea } from "#controls/textarea.tsx";

/**
 * Lists the page's renderers in registration order. The provider puts them after the field
 * library's, and the later of two renderers ranking the same is picked.
 */
export const renderers: readonly Renderer[] = [
  {
    draw: Amount,
    suits: (presentation, schema) =>
      schema["type"] === "number" && presentation.options?.["currency"] !== undefined
        ? RANK.constraint
        : undefined,
  },
  { draw: Textarea, suits: byControl("textarea") },
];
