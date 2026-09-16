/**
 * Defines the three concentric corners a recipe reads.
 *
 * @remarks
 *   Drawn from one value, so a theme that wants rounder cards restates the outermost corner and
 *   every nested corner follows.
 */

import { type SemanticTokens } from "#pandacss.ts";
import { radii as scale } from "#scales/depth.ts";

/**
 * Describes the radii a theme states.
 */
type Radii = NonNullable<SemanticTokens["radii"]>;

/**
 * Fixes the outermost corner, which is what a card and a dialog are drawn with.
 */
const LARGEST = "0.625rem";

/**
 * Lists the corners, `l1` to `l3`.
 */
export const radii: Radii = scale(LARGEST);
