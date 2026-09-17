/**
 * States Folio: an editorial product, set to be read. A violet brand on greys tinted to match,
 * body text a step larger than the foundation's, and a scale that climbs by a major third. Nothing
 * here names a component.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#semantic-tokens.ts";
import { textStyles } from "#text-styles.ts";
import { tokens } from "#tokens.ts";

/**
 * Draws a violet product on tinted greys, set larger and climbing faster.
 */
export const folio: Theme = defineTheme({ name: "folio", semanticTokens, textStyles, tokens });
