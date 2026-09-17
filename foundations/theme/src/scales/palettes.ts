/**
 * Fills the color contract in two calls: the three families from the page, and every palette from
 * the ramps.
 *
 * @remarks
 *   A root theme states every hue palette and every semantic palette. Each hue palette reads its
 *   ramp by name, so a theme that redraws a ramp under the same name moves the palette with it,
 *   and a theme points a semantic palette at another hue by naming the hue. What a theme leaves
 *   unnamed points where the foundation points it.
 */

import {
  type Hue,
  type HuePalette,
  HUES,
  type Palette,
  PALETTES,
  type SemanticPalette,
  type ThemeColors,
} from "#authoring/contract.ts";
import { recordOf } from "#record.ts";
import {
  backgrounds,
  borders,
  foregrounds,
  neutralFills,
  type PageLightness,
  paletteAlias,
  paletteRoles,
} from "#scales/color.ts";

/**
 * Points each semantic palette at the hue the foundation fills it with.
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
 * Describes the three families: the surfaces a page is built from, the inks it is written in and
 * the lines between things.
 */
export type Families = Pick<ThemeColors, "bg" | "border" | "fg">;

/**
 * Describes every palette: the eleven hue palettes, then the eight semantic ones.
 */
export type Palettes = Record<Hue, HuePalette> & Record<Palette, SemanticPalette>;

/**
 * Describes where a theme points a semantic palette, for each palette it moves.
 */
export type PaletteAliases = Readonly<Partial<Record<Palette, Hue>>>;

/**
 * Draws the three families: the surfaces a fixed distance from the page, and the inks and lines
 * from the grey ramp.
 *
 * @param pages - Where the page sits in each mode.
 * @param hue - The hue every surface is tinted with.
 * @param chroma - How far that tint goes.
 */
export function families(pages: PageLightness, hue: number, chroma: number): Families {
  return { bg: backgrounds(pages, hue, chroma), border: borders(), fg: foregrounds() };
}

/**
 * Fills every palette: the twelve roles of each hue from its ramp, and each semantic palette by
 * reference to the hue named for it, or to the foundation's hue where none is named.
 *
 * @remarks
 *   The neutral palette's quiet fills point at the page's own surfaces, so a grey button and the
 *   panel behind it are drawn from one place.
 */
export function palettes(aliases?: PaletteAliases): Palettes {
  const pointed = { ...ALIASES, ...aliases };

  return {
    ...recordOf(HUES, (hue) => paletteRoles(hue)),
    ...recordOf(PALETTES, (palette) => paletteAlias(pointed[palette])),
    neutral: { ...paletteAlias(pointed.neutral), ...neutralFills() },
  };
}
