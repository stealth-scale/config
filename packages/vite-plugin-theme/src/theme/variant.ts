/**
 * Completes a theme's variant with the foundation's values for every token it leaves unstated, so
 * a subtree switched to the theme is drawn from that theme alone.
 *
 * @remarks
 *   The compiler emits a theme's variant under its attribute as the custom properties the variant
 *   states, and a custom property inherits, so a theme that stated no font took the font of the
 *   theme around it. Restating every token the foundation defines under each theme makes each
 *   block self-contained, at the cost of the foundation's non-color tokens once per theme. A token
 *   is the deepest object that carries a `value`, and a theme's token replaces the foundation's
 *   whole, modes included.
 */

import { type Preset, type ThemeVariant } from "#pandacss.ts";

/**
 * Reports whether a value is a group of tokens rather than a token or a leaf value.
 */
function isGroup(value: unknown): value is Readonly<Record<string, unknown>> {
  return (
    typeof value === "object" && value !== null && !Array.isArray(value) && !("value" in value)
  );
}

/**
 * Merges the theme's tree over the foundation's, group by group, with the theme's token winning
 * wherever both state one.
 */
function merged(own: unknown, base: unknown): unknown {
  if (!isGroup(own) || !isGroup(base)) return own === undefined ? base : own;

  const keys = new Set([...Object.keys(base), ...Object.keys(own)]);

  return Object.fromEntries([...keys].map((key) => [key, merged(own[key], base[key])]));
}

/**
 * Completes a theme's variant with every token the foundation defines that the variant does not.
 *
 * @param variant - The theme's own values.
 * @param foundation - The preset of the system package, read for the tokens under its `extend`.
 * @returns The variant with the foundation's tokens and semantic tokens beneath its own.
 */
export function completed(variant: ThemeVariant, foundation: Preset): ThemeVariant {
  const tokens = merged(variant.tokens, foundation.theme?.extend?.tokens);
  const semanticTokens = merged(variant.semanticTokens, foundation.theme?.extend?.semanticTokens);

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- both trees are typed by the compiler, and a merge of two keeps their shape
  return {
    ...(tokens === undefined ? {} : { tokens }),
    ...(semanticTokens === undefined ? {} : { semanticTokens }),
  } as ThemeVariant;
}
