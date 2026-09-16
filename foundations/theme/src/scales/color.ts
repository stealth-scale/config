/**
 * Draws the colors a theme states: a ramp from a hue, the surfaces a page is built from, the inks
 * and the lines on it, and the twelve roles a palette fills.
 *
 * @remarks
 *   Every color is OKLCH, so a hue moves without its lightness moving with it. A theme states a
 *   hue and a chroma, and the shape of every ramp is the same, which is what makes two themes
 *   comparable at a glance.
 */

import {
  type Family,
  type Filled,
  type HuePalette,
  type Moded,
  type PaletteRoles,
  type Referenced,
  type Role,
  type SemanticPalette,
  type Status,
  STATUSES,
} from "#authoring/contract.ts";
import { type Tokens } from "#pandacss.ts";
import { recordOf } from "#record.ts";

/**
 * Describes the colors a ramp carries.
 */
type Colors = NonNullable<Tokens["colors"]>;

/**
 * Describes the surfaces a page is built from.
 */
type Backgrounds = Family<
  | "backdrop"
  | "DEFAULT"
  | "disabled"
  | "emphasized"
  | "inverted"
  | "muted"
  | "panel"
  | "popover"
  | "subtle"
>;

/**
 * Describes the inks a page is written in.
 */
type Foregrounds = Family<"DEFAULT" | "disabled" | "inverted" | "link" | "muted" | "subtle">;

/**
 * Describes the lines between things.
 */
type Borders = Family<"DEFAULT" | "emphasized" | "focus" | "inverted" | "muted" | "subtle">;

/**
 * Describes the tint every surface of a page is drawn with.
 */
interface Tint {
  /**
   * How far from grey the tint goes.
   */
  chroma: number;

  /**
   * The hue, in degrees around the wheel.
   */
  hue: number;
}

/**
 * Places each step of a ramp: how light it is, and how much of the stated chroma it takes.
 *
 * @remarks
 *   The steps run closer together at the dark end than at the light end, because a dark page is
 *   built from four surfaces that all have to sit under a light ink at 7:1. Saturation falls away
 *   at both ends because a color at 97% lightness cannot hold much chroma without turning pastel,
 *   and one at 15% cannot without turning to mud.
 */
const STOPS: ReadonlyArray<readonly [step: number, lightness: number, saturation: number]> = [
  [50, 97, 0.18],
  [100, 94, 0.32],
  [200, 88, 0.55],
  [300, 80, 0.78],
  [400, 72, 0.94],
  [500, 58, 1],
  [600, 47, 0.98],
  [700, 37, 0.9],
  [800, 28, 0.75],
  [900, 21, 0.58],
  [950, 15, 0.42],
];

/**
 * Places each step of an alpha ramp: how opaque a white or a black overlay is.
 */
const ALPHAS: ReadonlyArray<readonly [step: number, alpha: number]> = [
  [50, 0.04],
  [100, 0.06],
  [200, 0.08],
  [300, 0.16],
  [400, 0.24],
  [500, 0.36],
  [600, 0.48],
  [700, 0.64],
  [800, 0.8],
  [900, 0.92],
  [950, 0.95],
];

/**
 * Places each role on the ramp, in light mode and then in dark mode.
 *
 * @remarks
 *   The steps are the ones the accessibility gate accepts: every ink clears 7:1 on every fill it
 *   is drawn on, and every border and ring clears 3:1 on the page.
 */
const ROLE_STEPS: Readonly<Record<Role, readonly [light: number, dark: number]>> = {
  bg: [50, 950],
  border: [500, 500],
  "border.hover": [600, 400],
  contrast: [50, 950],
  emphasized: [300, 700],
  fg: [950, 50],
  "fg.muted": [900, 200],
  focusRing: [600, 400],
  muted: [200, 800],
  solid: [700, 400],
  "solid.hover": [800, 300],
  subtle: [100, 900],
};

/**
 * Fixes the chroma at which a hue reads as a color rather than as a tinted grey.
 */
const SATURATED = 0.1;

/**
 * Describes where the page sits in each color mode.
 */
export interface PageLightness {
  /**
   * The lightness of the page in dark mode, as a percentage.
   */
  dark: number;

  /**
   * The lightness of the page in light mode, as a percentage.
   */
  light: number;
}

/**
 * Writes one OKLCH color as CSS writes it.
 *
 * @param lightness - Percent, from black to white.
 * @param chroma - Distance from grey.
 * @param hue - Degrees around the wheel.
 */
export function oklch(lightness: number, chroma: number, hue: number): string {
  return `oklch(${lightness.toFixed(1)}% ${chroma.toFixed(4)} ${hue.toFixed(1)})`;
}

/**
 * Keeps a near-grey ramp at its stated chroma, and lets a saturated one fall away at the ends.
 *
 * @remarks
 *   A grey that lost chroma at the ends would read as two different greys, and a blue that kept
 *   it would read as pastel at the top and mud at the bottom.
 */
function share(saturation: number, chroma: number): number {
  const risk = Math.min(chroma / SATURATED, 1);

  return saturation * risk + (1 - risk);
}

/**
 * Draws the eleven steps of one hue, keyed `50` to `950`.
 *
 * @param hue - Degrees around the wheel.
 * @param chroma - How far from grey the middle of the ramp sits.
 */
export function colorScale(hue: number, chroma: number): Colors {
  return Object.fromEntries(
    STOPS.map(([step, lightness, saturation]) => [
      String(step),
      { value: oklch(lightness, chroma * share(saturation, chroma), hue) },
    ]),
  );
}

/**
 * Draws the eleven steps of a white or a black overlay, keyed `50` to `950`.
 *
 * @param base - Whether the overlay lightens or darkens what it covers.
 */
export function alphaScale(base: "black" | "white"): Colors {
  const lightness = base === "white" ? 100 : 0;

  return Object.fromEntries(
    ALPHAS.map(([step, alpha]) => [
      String(step),
      { value: `oklch(${String(lightness)}% 0 0 / ${alpha.toFixed(2)})` },
    ]),
  );
}

/**
 * Writes a reference to one step of a ramp in light mode and another in dark mode.
 */
function stepped(name: string, light: number, dark: number): Moded {
  return {
    value: { _dark: `{colors.${name}.${String(dark)}}`, base: `{colors.${name}.${String(light)}}` },
  };
}

/**
 * Writes a reference to a color token that carries both modes itself.
 */
function referenced(path: string): Referenced {
  return { value: `{colors.${path}}` };
}

/**
 * Writes the status members of a family, each a reference into a status palette's role.
 */
function statuses(role: string): Record<Status, Filled> {
  return recordOf(STATUSES, (status) => referenced(`${status}.${role}`));
}

/**
 * Places one surface a number of percentage points from a page, clamped so a surface near white
 * or near black stops rather than wraps.
 */
function lit(page: number, steps: number, tint: Tint): string {
  return oklch(Math.min(Math.max(page + steps, 0), 100), tint.chroma, tint.hue);
}

/**
 * Places a surface the same distance away from both pages, which is towards white on a dark page
 * and towards black on a light one.
 */
function away(pages: PageLightness, steps: number, tint: Tint): Moded {
  return { value: { _dark: lit(pages.dark, steps, tint), base: lit(pages.light, -steps, tint) } };
}

/**
 * Places a surface at one distance on a dark page and another on a light one, where the two pages
 * do not want the same step.
 */
function split(pages: PageLightness, dark: number, light: number, tint: Tint): Moded {
  return { value: { _dark: lit(pages.dark, dark, tint), base: lit(pages.light, light, tint) } };
}

/**
 * Draws the surfaces a page is built from, each a fixed distance from the page itself.
 *
 * @remarks
 *   The distances are signed rather than absolute: a panel is lighter than a dark page and darker
 *   than a light one, so one number covers both modes. The status members reference the status
 *   palettes' quiet fills.
 * @param pages - Where the page sits in each mode.
 * @param hue - The hue every surface is tinted with.
 * @param chroma - How far that tint goes.
 */
export function backgrounds(pages: PageLightness, hue: number, chroma: number): Backgrounds {
  const tint = { chroma, hue };

  return {
    backdrop: { value: { _dark: "oklch(0% 0 0 / 0.64)", base: "oklch(0% 0 0 / 0.44)" } },
    DEFAULT: split(pages, 0, 0, tint),
    disabled: away(pages, 7, tint),
    emphasized: away(pages, 11, tint),
    inverted: split(pages, pages.light - pages.dark, pages.dark - pages.light, tint),
    muted: away(pages, 7, tint),
    panel: split(pages, 4, 3, tint),
    popover: split(pages, 7, 3, tint),
    subtle: split(pages, 4, -2, tint),
    ...statuses("subtle"),
  };
}

/**
 * Draws the inks a page is written in, against the grey ramp it was built from.
 *
 * @remarks
 *   `muted` clears 7:1 on every surface and `subtle` clears 3:1, which is the boundary ratio and
 *   not the text ratio, so a recipe never writes `subtle` as a text color. The link ink and the
 *   status inks reference the palettes that own them.
 * @param name - The ramp to read, which is the theme's grey unless it says otherwise.
 */
export function foregrounds(name = "gray"): Foregrounds {
  return {
    DEFAULT: stepped(name, 950, 50),
    disabled: referenced("fg.subtle"),
    inverted: stepped(name, 50, 950),
    link: referenced("primary.fg"),
    muted: stepped(name, 800, 300),
    subtle: stepped(name, 600, 500),
    ...statuses("fg"),
  };
}

/**
 * Draws the lines between things, one step further from the page at each weight.
 *
 * @remarks
 *   `emphasized` clears 3:1 on every surface, which is what 1.4.11 asks of a control's edge. The
 *   focus line references the primary palette's ring, and the status lines the palettes that own
 *   them.
 * @param name - The ramp to read.
 */
export function borders(name = "gray"): Borders {
  return {
    DEFAULT: stepped(name, 300, 700),
    emphasized: stepped(name, 600, 500),
    focus: referenced("primary.focusRing"),
    inverted: stepped(name, 700, 300),
    muted: stepped(name, 200, 800),
    subtle: stepped(name, 100, 900),
    ...statuses("border"),
  };
}

/**
 * Nests the twelve roles the way the compiler reads them, each filled by one call.
 *
 * @typeParam Leaf - The shape each role is filled with.
 */
function roles<Leaf>(fill: (role: Role) => Leaf): PaletteRoles<Leaf> {
  return {
    bg: fill("bg"),
    border: { DEFAULT: fill("border"), hover: fill("border.hover") },
    contrast: fill("contrast"),
    emphasized: fill("emphasized"),
    fg: { DEFAULT: fill("fg"), muted: fill("fg.muted") },
    focusRing: fill("focusRing"),
    muted: fill("muted"),
    solid: { DEFAULT: fill("solid"), hover: fill("solid.hover") },
    subtle: fill("subtle"),
  };
}

/**
 * Draws the twelve roles of a hue palette from its ramp, each in both modes.
 *
 * @remarks
 *   A recipe never names a step of a ramp. It names a role, and the ramp decides which step fills
 *   it, which is what lets one recipe draw in every palette an application installs.
 * @param name - The ramp the roles are drawn from.
 */
export function paletteRoles(name: string): HuePalette {
  return roles((role) => {
    const [light, dark] = ROLE_STEPS[role];

    return stepped(name, light, dark);
  });
}

/**
 * Fills the twelve roles of a semantic palette by reference to a hue palette.
 *
 * @remarks
 *   The reference resolves to the hue's custom property, and the hue palette defines both modes,
 *   so `primary: paletteAlias("teal")` is a whole remap in one line.
 * @param hue - The hue palette every role points at.
 */
export function paletteAlias(hue: string): SemanticPalette {
  return roles((role) => referenced(`${hue}.${role}`));
}

/**
 * Points the neutral palette's quiet fills at the page's own surfaces, so a grey button and the
 * panel behind it are drawn from one place.
 */
export function neutralFills(): Pick<SemanticPalette, "emphasized" | "muted" | "subtle"> {
  return {
    emphasized: referenced("bg.emphasized"),
    muted: referenced("bg.muted"),
    subtle: referenced("bg.subtle"),
  };
}
