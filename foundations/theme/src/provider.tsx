/**
 * Writes the theme and the color mode a page is switched to onto the document root.
 *
 * @remarks
 *   An attribute left unstated is removed rather than written, so the first theme the application
 *   lists draws the page and the operating system's preference decides the mode. The attributes
 *   are written in an effect, after the first paint. A page that has to paint in a mode the reader
 *   chose on an earlier visit writes that attribute in its markup as well.
 */

import { type ReactElement, type ReactNode, useEffect } from "react";

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
 */
export function ThemeProvider({ children, colorMode, theme }: ThemeProviderProps): ReactElement {
  useEffect(() => {
    write(THEME_ATTRIBUTE, theme);
    write(COLOR_MODE_ATTRIBUTE, colorMode);
  }, [colorMode, theme]);

  return <ThemeContext value={{ colorMode, theme }}>{children}</ThemeContext>;
}
