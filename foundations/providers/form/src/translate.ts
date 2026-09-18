/**
 * Types the translator every word of a form goes through, and writes a path out as words for a
 * form nobody has translated.
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
 * Answers the default for every key, which is what a form has before anybody translates it.
 */
export const untranslated: Translate = (_keys, { defaultValue }) => defaultValue;

/**
 * Builds a translator over words already translated, for a specification or a form whose words
 * arrive with it.
 *
 * @remarks
 *   Nothing is interpolated. A message reading a value belongs in a catalogue an i18n library
 *   serves.
 */
export function translateFrom(words: Readonly<Record<string, string>>): Translate {
  return (keys, { defaultValue }) => {
    for (const key of typeof keys === "string" ? [keys] : keys) {
      const found = words[key];

      if (found !== undefined) return found;
    }

    return defaultValue;
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
