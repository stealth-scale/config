/**
 * Carries the theme and the color mode a page is switched to, for a part that wants to know.
 *
 * @remarks
 *   The provider writes both onto the document root as attributes, which is what the stylesheet
 *   reads, so nothing here is required to draw. The context is for a part that does something by
 *   mode that no rule can, such as picking an image. A page that writes the attributes itself
 *   reads undefined for both.
 */

import { createContext, useContext } from "react";

/**
 * Selects one of the two color modes.
 */
export type ColorMode = "dark" | "light";

/**
 * Describes what a page is switched to, each undefined where the page states nothing and the
 * application's first theme or the reader's preference decides.
 */
export interface Switched {
  /**
   * The color mode the page is switched to.
   */
  colorMode: ColorMode | undefined;

  /**
   * The name of the theme the page is switched to.
   */
  theme: string | undefined;
}

/**
 * Carries what the nearest provider above was given.
 */
export const ThemeContext = createContext<Switched>({ colorMode: undefined, theme: undefined });

/**
 * Reads the theme and the color mode the nearest provider above set, or undefined for each
 * outside one.
 */
export function useTheme(): Switched {
  return useContext(ThemeContext);
}
