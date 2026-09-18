/**
 * Hands the chosen colour mode to the theme provider, which owns both document attributes.
 */

import { type ReactElement, type ReactNode } from "react";

import { useColorMode } from "@stealthscale/provider-color-mode";
import { ThemeProvider } from "@stealthscale/theme";

/**
 * Describes what {@link Themed} is given.
 */
export interface ThemedProps {
  /**
   * The page drawn in the theme.
   */
  readonly children?: ReactNode | undefined;

  /**
   * The theme to switch the document to, or none for the application's first.
   */
  readonly theme?: string | undefined;
}

/**
 * Mounts the theme provider with the colour mode the provider above it settled on.
 *
 * @remarks
 *   Both providers write `data-color-mode` on the document root, and the theme provider removes the
 *   attribute where it is given no mode. Reading the choice and passing it on makes the two write
 *   the same thing rather than undoing each other. A person following the machine is passed
 *   nothing, which is how both spell that.
 * @param props - The theme and the page. `ThemedProps` documents both.
 */
export function Themed({ children, theme }: ThemedProps): ReactElement {
  const { choice } = useColorMode();

  return (
    <ThemeProvider {...(choice === "system" ? {} : { colorMode: choice })} theme={theme}>
      {children}
    </ThemeProvider>
  );
}
