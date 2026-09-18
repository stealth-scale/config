/**
 * Types the translator every word of a form goes through, builds one over words already
 * translated, and writes a path out as words for a form nobody has translated.
 */

import { collapse } from "#path.ts";

/**
 * Describes what a translator is handed beside the keys: the words to answer where no catalogue
 * has a key, and the values the message reads.
 */
export interface TranslateOptions {
  /**
   * The words to answer where no key is found: the schema's own text, the engine's message, or
   * the path written out.
   */
  readonly defaultValue: string;

  /**
   * The values the message reads, under the names the message uses.
   */
  readonly [value: string]: unknown;
}

/**
 * Answers the words for the first key a catalogue has, or the default where it has none.
 *
 * @remarks
 *   The shape is i18next's `t` given a `defaultValue`, so an application hands in its `t` as it
 *   is and a specification hands in {@link translateFrom} over a map. The keys are tried in order,
 *   most specific first, and the default is interpolated as a found message is.
 */
export type Translate = (keys: string | string[], options: TranslateOptions) => string;

/**
 * Matches a placeholder in a message, written as i18next writes one under its defaults.
 */
const PLACEHOLDER = /\{\{(\w+)\}\}/gu;

/**
 * Writes one value into a message: a string or a number as it is, and anything else as nothing.
 */
function written(value: unknown): string {
  return typeof value === "string" || typeof value === "number" ? String(value) : "";
}

/**
 * Writes the values into the placeholders of a message.
 *
 * @remarks
 *   The placeholder is i18next's `{{name}}`, so a message written for a catalogue an i18n library
 *   serves reads the same under a translator built here.
 */
export function interpolate(text: string, values: Readonly<Record<string, unknown>>): string {
  return text.replaceAll(PLACEHOLDER, (_, name: string) => written(values[name]));
}

/**
 * Returns the default for every key with the values written into it, which is what a form reads
 * before anybody translates it.
 */
export const untranslated: Translate = (_keys, { defaultValue, ...values }) =>
  interpolate(defaultValue, values);

/**
 * Builds a translator over words already translated, for a specification or an application
 * without an i18n library.
 *
 * @remarks
 *   The translator does what i18next's `t` does under its defaults. It tries the keys in order,
 *   returns the default where the words have none of them, and writes the values into the
 *   placeholders of whichever it returns.
 */
export function translateFrom(words: Readonly<Record<string, string>>): Translate {
  return (keys, { defaultValue, ...values }) => {
    const found = (typeof keys === "string" ? [keys] : keys)
      .map((key) => words[key])
      .find((word) => word !== undefined);

    return interpolate(found ?? defaultValue, values);
  };
}

/**
 * Matches the boundary between a lower-case letter and an upper-case one.
 */
const CAMEL = /([a-z])([A-Z])/gu;

/**
 * Matches an index or a collapsed index at the end of a path.
 */
const TRAILING_INDEX = /\[\d*\]$/u;

/**
 * Writes a path out as words, which is the last thing a label falls back to.
 *
 * @remarks
 *   The last segment is used, an index on it is dropped, camel case is split, and the first letter
 *   is capitalised. `billing.vatNumber` reads "Vat number" and `lines[].amount` reads "Amount".
 * @returns The words, or an empty string for an empty path.
 */
export function worded(path: string): string {
  const collapsed = collapse(path);
  const last = collapsed.slice(collapsed.lastIndexOf(".") + 1);
  const bare = last.replace(TRAILING_INDEX, "").replaceAll(CAMEL, "$1 $2").toLowerCase();

  return bare.charAt(0).toUpperCase() + bare.slice(1);
}
