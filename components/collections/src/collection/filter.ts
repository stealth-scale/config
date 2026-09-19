/**
 * Builds the test a list is narrowed by, folded the way the locale in force folds text.
 *
 * @remarks
 *   A reader typing `cafe` means to find `Café`, and one typing in lower case means to find a row
 *   that is capitalised. Both fall out of the collator the locale supplies rather than out of a
 *   comparison this package writes, so a locale that folds differently is answered without a
 *   second implementation.
 */

import { useMemo } from "react";

import { createFilter } from "@zag-js/i18n-utils";

/**
 * Describes the tests a filter offers, each taking the text to search and the text typed.
 */
export interface Filter {
  /**
   * Returns true where the text holds the typed text anywhere in it.
   */
  contains: (haystack: string, needle: string) => boolean;

  /**
   * Returns true where the text ends with the typed text.
   */
  endsWith: (haystack: string, needle: string) => boolean;

  /**
   * Returns true where the text opens with the typed text.
   */
  startsWith: (haystack: string, needle: string) => boolean;
}

/**
 * Describes how strictly a filter tells two strings apart.
 */
export interface FilterOptions {
  /**
   * The locale whose folding rules apply. The document's own unless you state one.
   */
  locale?: string | undefined;

  /**
   * How much difference counts. `base` folds case and accents together, which is what a reader
   * typing quickly expects. Default: `base`.
   */
  sensitivity?: "accent" | "base" | "case" | "variant" | undefined;
}

/**
 * Answers the tests a list is narrowed by.
 *
 * @remarks
 *   The collator behind these is expensive to build and cheap to call, so it is built once per
 *   locale and sensitivity rather than on every keystroke.
 * @param options - The locale and how strictly it tells two strings apart.
 * @returns The three tests, each folded by that locale.
 */
export function useFilter(options: FilterOptions = {}): Filter {
  const { locale, sensitivity = "base" } = options;

  return useMemo(() => createFilter({ locale, sensitivity }), [locale, sensitivity]);
}
