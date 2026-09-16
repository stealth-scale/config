/**
 * Defines the palettes: twelve roles on every hue ramp, and eight semantic palettes that fill the
 * same roles by reference to a hue.
 *
 * @remarks
 *   A recipe names an intent, `primary` or `error`, and a theme decides the hue by pointing the
 *   palette at another ramp. The neutral palette's quiet fills point at the page's own surfaces,
 *   so a grey button and the panel behind it are drawn from one place.
 */

import {
  type Hue,
  type HuePalette,
  HUES,
  type Palette,
  PALETTES,
  type SemanticPalette,
} from "#authoring/contract.ts";
import { recordOf } from "#record.ts";
import { neutralFills, paletteAlias, paletteRoles } from "#scales/color.ts";

/**
 * Points each semantic palette at the hue that fills it.
 *
 * @remarks
 *   `info` and `primary` share a hue, which is what most systems do and what a theme that wants
 *   them apart remaps in one line.
 */
const ALIASES: Readonly<Record<Palette, Hue>> = {
  accent: "teal",
  error: "red",
  info: "blue",
  neutral: "gray",
  primary: "blue",
  secondary: "purple",
  success: "green",
  warning: "orange",
};

/**
 * Lists every palette: the eleven hue palettes, then the eight semantic ones.
 */
export const palettes: Record<Hue, HuePalette> & Record<Palette, SemanticPalette> = {
  ...recordOf(HUES, (hue) => paletteRoles(hue)),
  ...recordOf(PALETTES, (palette) => paletteAlias(ALIASES[palette])),
  neutral: { ...paletteAlias(ALIASES.neutral), ...neutralFills() },
};
