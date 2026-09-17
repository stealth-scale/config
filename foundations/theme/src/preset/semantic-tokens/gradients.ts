/**
 * Defines the gradients a recipe reads by name: the brand sweep, the shine that crosses a surface,
 * and the aurora a backdrop drifts through.
 *
 * @remarks
 *   Each stop is a semantic color, so a theme that moves a palette moves every gradient drawn in
 *   it, and both modes come with the colors. The shine is an overlay of white, which reads on a
 *   fill of any hue. The aurora drifts through the muted fills rather than the subtle ones,
 *   because a subtle fill sits two points of lightness from a light page.
 */

import { type SemanticTokens } from "#pandacss.ts";

/**
 * Describes the gradients a theme states.
 */
type Gradients = NonNullable<SemanticTokens["gradients"]>;

/**
 * Lists the gradients.
 */
export const gradients: Gradients = {
  aurora: {
    value:
      "linear-gradient(120deg, {colors.primary.muted} 0%, {colors.accent.muted} 35%, {colors.secondary.muted} 70%, {colors.primary.muted} 100%)",
  },
  brand: { value: "linear-gradient(to right, {colors.primary.solid}, {colors.accent.solid})" },
  shine: {
    value: "linear-gradient(105deg, transparent 40%, {colors.whiteAlpha.500} 50%, transparent 60%)",
  },
};
