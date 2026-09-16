/**
 * Measures contrast the way WCAG defines it, for the ratios 1.4.3, 1.4.6 and 1.4.11 are written
 * against.
 *
 * @remarks
 *   Written here rather than taken from a color library, because the whole of it is two matrices,
 *   a transfer curve and a dot product. A color reaches the measurement four ways: OKLCH with a
 *   percentage as a theme writes it, OKLCH scaled to one as a browser hands it back, and hex or
 *   `rgb()` for anything a browser serialised.
 */

/**
 * Describes a color in linear sRGB, each channel running from 0 to 1.
 */
interface Linear {
  /**
   * The blue channel.
   */
  blue: number;

  /**
   * The green channel.
   */
  green: number;

  /**
   * The red channel.
   */
  red: number;
}

/**
 * Matches an OKLCH color, whether the lightness carries a percentage or runs 0 to 1.
 */
const OKLCH = /^oklch\(\s*(?<lightness>[\d.]+)(?<percent>%)?\s+(?<chroma>[\d.]+)\s+(?<hue>[\d.]+)/u;

/**
 * Matches a hex color of three, four, six or eight digits.
 */
const HEX = /^#(?<digits>[\da-f]{3,8})$/iu;

/**
 * Matches the `rgb()` a browser serialises a color to, comma-separated or not.
 */
const RGB = /^rgba?\(\s*(?<red>[\d.]+)[\s,]+(?<green>[\d.]+)[\s,]+(?<blue>[\d.]+)/u;

/**
 * Fixes the ratio normal text has to clear at each level.
 *
 * @remarks
 *   Large text clears at 3 and 4.5. That is a judgement about the type rather than the colors, so
 *   a caller measuring a heading compares the ratio itself.
 */
const LEVELS = { AA: 4.5, AAA: 7 };

/**
 * Selects how much contrast is asked for.
 */
export type Level = keyof typeof LEVELS;

/**
 * Undoes the sRGB transfer curve, so a channel as a stylesheet writes it becomes the light a
 * display emits.
 */
function decoded(channel: number): number {
  return channel <= 0.040_45 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

/**
 * Converts an OKLCH color to linear sRGB, unclamped.
 *
 * @remarks
 *   A channel outside 0 to 1 is a color outside the display's gamut, and clamping it here would
 *   report a contrast the reader never sees. The matrices are Björn Ottosson's. A percentage runs
 *   to a hundred and a bare number runs to one, and CSS accepts both.
 * @returns The color in linear sRGB, or undefined where the value is not OKLCH.
 */
function fromOklch(color: string): Linear | undefined {
  const read = OKLCH.exec(color)?.groups;

  if (read === undefined) return undefined;

  const lightness = Number(read["lightness"]) / (read["percent"] === undefined ? 1 : 100);
  const chroma = Number(read["chroma"]);
  const radians = (Number(read["hue"]) * Math.PI) / 180;
  const a = chroma * Math.cos(radians);
  const b = chroma * Math.sin(radians);
  const long = (lightness + 0.396_337_777_4 * a + 0.215_803_757_3 * b) ** 3;
  const medium = (lightness - 0.105_561_345_8 * a - 0.063_854_172_8 * b) ** 3;
  const short = (lightness - 0.089_484_177_5 * a - 1.291_485_548 * b) ** 3;

  return {
    blue: -0.004_196_086_3 * long - 0.703_418_614_7 * medium + 1.707_614_701 * short,
    green: -1.268_438_004_6 * long + 2.609_757_401_1 * medium - 0.341_319_396_5 * short,
    red: 4.076_741_662_1 * long - 3.307_711_591_3 * medium + 0.230_969_929_2 * short,
  };
}

/**
 * Widens a three or four digit hex to six or eight by pairing each digit with itself.
 */
function widened(digits: string): string {
  return digits.length > 4 ? digits : digits.replaceAll(/([\da-f])/giu, "$1$1");
}

/**
 * Reads the channel whose pair of digits starts at an index out of a six or eight digit hex, in
 * linear light.
 */
function byteAt(digits: string, index: number): number {
  return decoded(Number.parseInt(digits.slice(index, index + 2), 16) / 255);
}

/**
 * Converts a hex or `rgb()` color to linear sRGB.
 *
 * @returns The color in linear sRGB, or undefined where the value is neither.
 */
function fromSrgb(color: string): Linear | undefined {
  const digits = HEX.exec(color)?.groups?.["digits"];

  if (digits !== undefined) {
    const bytes = widened(digits);

    return { blue: byteAt(bytes, 4), green: byteAt(bytes, 2), red: byteAt(bytes, 0) };
  }

  const read = RGB.exec(color)?.groups;

  if (read === undefined) return undefined;

  return {
    blue: decoded(Number(read["blue"]) / 255),
    green: decoded(Number(read["green"]) / 255),
    red: decoded(Number(read["red"]) / 255),
  };
}

/**
 * Measures relative luminance as WCAG defines it.
 *
 * @param color - The color as CSS writes it: OKLCH, hex or `rgb()`.
 * @returns The luminance, 0 for black and 1 for white, or `NaN` where the color cannot be read.
 */
export function luminance(color: string): number {
  const linear = fromOklch(color) ?? fromSrgb(color);

  if (linear === undefined) return Number.NaN;

  return 0.2126 * linear.red + 0.7152 * linear.green + 0.0722 * linear.blue;
}

/**
 * Measures the contrast ratio between two colors, from 1 to 21.
 *
 * @remarks
 *   The order of the two does not matter, and the two need not be written the same way.
 * @returns The ratio, or `NaN` where either color cannot be read, so a caller tells an unreadable
 *   pair from an unmeasured one.
 */
export function contrast(foreground: string, background: string): number {
  const front = luminance(foreground);
  const back = luminance(background);

  if (Number.isNaN(front) || Number.isNaN(back)) return Number.NaN;

  const [darker, lighter] = front < back ? [front, back] : [back, front];

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Reports whether text of one color can be read on another at a level.
 *
 * @remarks
 *   `AA` is what 1.4.3 asks of normal text and `AAA` what 1.4.6 asks. A color that cannot be read
 *   clears nothing.
 */
export function readable(foreground: string, background: string, level: Level = "AA"): boolean {
  return contrast(foreground, background) >= LEVELS[level];
}
