/**
 * Reads a BCP 47 language tag through the engine's own ECMA-402 implementation.
 *
 * @remarks
 *   `Intl` carries the locale data, including the likely subtags that widening `zh` to `zh-Hans-CN`
 *   needs. The one table here is the right-to-left scripts, for the reason `directionOf` gives.
 */

/**
 * A canonical BCP 47 language tag, such as `nl`, `en-GB` or `zh-Hant-TW`.
 *
 * @remarks
 *   A string rather than a class, so one tag serves as a catalogue key, a URL segment and a `lang`
 *   attribute without being unwrapped.
 */
export type Tag = string;

/**
 * The subtags a caller reaches for.
 */
export interface Parts {
  /**
   * The primary language, such as `nl`, `en` or `zh`.
   */
  readonly language: string;

  /**
   * The region, where the tag names one, such as `GB` or `TW`.
   */
  readonly region: string | undefined;

  /**
   * The script, where the tag names one, such as `Hant`.
   */
  readonly script: string | undefined;
}

/**
 * Canonicalises a tag, correcting the case of each subtag the way BCP 47 writes it.
 *
 * @param tag - The tag as it arrived, from a header, a URL or a manifest.
 * @returns The canonical tag, or undefined when the string is not a tag.
 */
export function canonical(tag: string): Tag | undefined {
  try {
    return Intl.getCanonicalLocales(tag)[0];
  } catch {
    return undefined;
  }
}

/**
 * Splits a tag into its language, script and region.
 *
 * @param tag - The tag to read.
 * @returns The subtags, or undefined when the string is not a tag.
 */
export function parts(tag: string): Parts | undefined {
  try {
    const locale = new Intl.Locale(tag);

    return { language: locale.language, region: locale.region, script: locale.script };
  } catch {
    return undefined;
  }
}

/**
 * Widens a tag to the script and region the engine considers likely, so two tags written at
 * different depths can be compared.
 *
 * @param tag - The tag to widen.
 * @returns The widened tag, such as `zh-Hans-CN` for `zh`, or undefined when the string is not a
 *   tag.
 */
export function widened(tag: string): Tag | undefined {
  try {
    return new Intl.Locale(tag).maximize().toString();
  } catch {
    return undefined;
  }
}

/**
 * Truncates a tag from most specific to least, which is the order ECMA-402's lookup matcher uses.
 *
 * @remarks
 *   A single-character subtag opens an extension, such as `-u-` or `-x-`. Everything from there on
 *   is dropped rather than truncated, as the lookup algorithm requires.
 * @param tag - The tag to truncate.
 * @returns The tag and each shorter form, most specific first. `zh-Hant-TW` gives `zh-Hant-TW`,
 *   `zh-Hant`, `zh`. Empty when the string is not a tag.
 */
export function chain(tag: string): readonly Tag[] {
  const start = canonical(tag);

  if (start === undefined) return [];

  const subtags = start.split("-");
  const extension = subtags.findIndex((subtag, index) => index > 0 && subtag.length === 1);
  const named = extension === -1 ? subtags : subtags.slice(0, extension);
  const walked: Tag[] = [];

  for (let depth = named.length; depth > 0; depth -= 1) {
    walked.push(named.slice(0, depth).join("-"));
  }

  return walked;
}

/**
 * The direction a script's text runs in.
 */
export type Direction = "ltr" | "rtl";

/**
 * The right-to-left scripts a living language widens to, as CLDR's script metadata marks them.
 *
 * @remarks
 *   A table rather than `Intl.Locale.getTextInfo`, because the engines disagree on it. Bun's ICU
 *   calls Thaana and Hanifi Rohingya left to right, while every engine agrees on the likely script,
 *   so the script decides.
 */
const RIGHT_TO_LEFT: ReadonlySet<string> = new Set([
  "Adlm",
  "Arab",
  "Aran",
  "Hebr",
  "Mand",
  "Nkoo",
  "Rohg",
  "Samr",
  "Syrc",
  "Thaa",
  "Yezi",
]);

/**
 * Returns the direction a tag's text runs in, from the script it names or the one the engine
 * considers likely for its language.
 *
 * @param tag - The tag to read.
 * @returns `rtl` for `ar`, `he`, `fa`, `ur` and `dv`. `ltr` for every other script, for `ar-Latn`,
 *   and for a string that is not a tag.
 */
export function directionOf(tag: string): Direction {
  try {
    const script = new Intl.Locale(tag).maximize().script;

    return script !== undefined && RIGHT_TO_LEFT.has(script) ? "rtl" : "ltr";
  } catch {
    return "ltr";
  }
}

/**
 * Widens a tag and truncates the result, which is the depth a lookup compares two tags at.
 *
 * @remarks
 *   A request and an offer that widen to different regions still share a script, so both sides
 *   truncate their widened tag rather than comparing the widened tags whole.
 * @param tag - The tag to widen and truncate.
 * @returns The widened tag and each shorter form, most specific first. `zh-HK` gives `zh-Hant-HK`,
 *   `zh-Hant`, `zh`. Empty when the string is not a tag.
 */
export function widenedChain(tag: string): readonly Tag[] {
  const wide = widened(tag);

  return wide === undefined ? [] : chain(wide);
}
