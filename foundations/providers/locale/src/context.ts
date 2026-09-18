/**
 * Carries the locale in force down the tree, and reads it back.
 */

import { createContext, use } from "react";

import { type Direction } from "#tags.ts";

/**
 * The locale in force, with everything a switcher needs to change it.
 */
export interface LocaleContextValue {
  /**
   * The direction the writing runs in, which follows from the locale's script.
   */
  readonly direction: Direction;

  /**
   * True while a change of locale is under way. The tree stays in the old locale until it lands, so
   * a switcher shows this rather than a blank.
   */
  readonly isPending: boolean;

  /**
   * The locale in force, as one of the tags the application offers.
   */
  readonly locale: string;

  /**
   * Every locale the application offers, in the order it offered them.
   */
  readonly locales: readonly [string, ...string[]];

  /**
   * Reads in a different locale from now on. A tag the application does not offer is ignored.
   */
  readonly setLocale: (locale: string) => void;
}

/**
 * Carries the locale every component below a provider reads.
 */
export const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

/**
 * Returns the locale in force, its direction, the others on offer, and how to change it.
 *
 * @throws {@link Error} When no provider stands above the caller.
 */
export function useLocale(): LocaleContextValue {
  const value = use(LocaleContext);

  if (value === undefined) {
    throw new Error("useLocale was called outside a LocaleProvider.");
  }

  return value;
}
