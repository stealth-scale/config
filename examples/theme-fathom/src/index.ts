/**
 * States Fathom: a deep teal product on marine greys, rounder than the foundation. Everything here
 * is a value, and nothing names a component, so the theme installs in a repository whose
 * components it has never met.
 *
 * @packageDocumentation
 */

import { defineTheme, type Theme } from "@stealthscale/theme/authoring";

import { semanticTokens } from "#semantic-tokens.ts";
import { tokens } from "#tokens.ts";

/**
 * Draws a deep teal product on marine greys, rounder than the foundation and cast in its own hue.
 */
export const fathom: Theme = defineTheme({ name: "fathom", semanticTokens, tokens });
