/**
 * Carries the colour mode down the tree, and reads it back.
 */

import { createContext, useContext } from "react";

import { type ColorMode } from "@stealthscale/theme";

import { type ColorModeChoice } from "#setting.ts";

/**
 * Describes what {@link useColorMode} answers.
 */
export interface ColorModeContextValue {
  /**
   * The choice a person made, which may be to follow the machine.
   */
  choice: ColorModeChoice;

  /**
   * The way the page is drawn, which is never a choice to follow the machine.
   */
  colorMode: ColorMode;

  /**
   * Remembers a choice and redraws the page in it.
   */
  setColorMode: (choice: ColorModeChoice) => void;
}

/**
 * Carries what the nearest provider above settled on.
 *
 * @remarks
 *   Undefined outside a provider, which is what lets the hook refuse rather than answer a mode
 *   nothing is writing.
 */
export const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

/**
 * Reads which way the page is drawn, the choice behind it, and how to change it.
 *
 * @returns The mode in force, the choice, and the setter.
 * @throws {@link Error} When there is no provider above the caller.
 */
export function useColorMode(): ColorModeContextValue {
  const value = useContext(ColorModeContext);

  if (value === undefined) throw new Error("useColorMode needs a ColorModeProvider above it");

  return value;
}
