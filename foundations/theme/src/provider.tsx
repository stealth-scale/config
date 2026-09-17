/**
 * Writes the theme and the color mode a page is switched to onto the document root.
 *
 * @remarks
 *   The provider owns both attributes on the document root while it is mounted. An attribute left
 *   unstated is removed rather than written, so the first theme the application lists draws the
 *   page and the operating system's preference decides the mode.
 *   The attributes are written in an effect, after the first paint. A page that has to paint in a
 *   mode the reader chose on an earlier visit writes that attribute in its markup and hands the
 *   same value to the provider, which then writes what is already there. Handing it nothing
 *   removes the attribute on the first effect and the page snaps to the preference.
 *   Neither attribute is removed when the provider unmounts, because a tree swapped out mid-life
 *   would otherwise flash the page to the default theme on the way.
 */

import { type ReactElement, type ReactNode, useEffect, useMemo } from "react";

import { COLOR_MODE_ATTRIBUTE, THEME_ATTRIBUTE } from "#attributes.ts";
import { type ColorMode, ThemeContext } from "#use-theme.ts";

/**
 * Describes what the provider is given: the theme and the mode, each optional, and the page.
 */
export interface ThemeProviderProps {
  /**
   * The page the theme and the mode apply to.
   */
  children?: ReactNode | undefined;

  /**
   * The color mode to switch the document to, or none to follow the reader's preference.
   */
  colorMode?: ColorMode | undefined;

  /**
   * The name of the theme to switch the document to, or none for the application's first.
   */
  theme?: string | undefined;
}

/**
 * Writes one attribute onto the document root, or removes it where the value is absent.
 */
function write(attribute: string, value: string | undefined): void {
  if (value === undefined) document.documentElement.removeAttribute(attribute);
  else document.documentElement.setAttribute(attribute, value);
}

/**
 * Switches the document to a theme and a color mode, and tells every part below which.
 *
 * @remarks
 *   The pair handed down is held across a render that changes neither, so a part that reads it
 *   redraws when the page switches and not when the provider's parent redraws. The published
 *   package carries no compiler, so nothing else holds it.
 */
export function ThemeProvider({ children, colorMode, theme }: ThemeProviderProps): ReactElement {
  const switched = useMemo(() => ({ colorMode, theme }), [colorMode, theme]);

  useEffect(() => {
    write(THEME_ATTRIBUTE, theme);
    write(COLOR_MODE_ATTRIBUTE, colorMode);
  }, [colorMode, theme]);

  return <ThemeContext value={switched}>{children}</ThemeContext>;
}
