/**
 * Puts a colour mode in scope, remembers what a person chose, and writes it where the stylesheet
 * reads it.
 */

import { type ReactElement, type ReactNode, useLayoutEffect, useMemo } from "react";

import { type SettingStore, useSetting } from "@stealthscale/settings";
import { COLOR_MODE_ATTRIBUTE } from "@stealthscale/theme";

import { ColorModeContext } from "#context.ts";
import { useSystemColorMode } from "#scheme.ts";
import { type ColorModeChoice, colorModeSetting } from "#setting.ts";

/**
 * Describes what {@link ColorModeProvider} is given.
 */
export interface ColorModeProviderProps {
  /**
   * The application the choice is remembered under, so two applications on one origin keep their
   * own.
   */
  app: string;

  /**
   * The page drawn in the mode.
   */
  children?: ReactNode | undefined;

  /**
   * Where to keep the choice. The page's local storage where this is absent.
   */
  store?: SettingStore | undefined;
}

/**
 * Writes the chosen mode on the document root, or removes it where the choice is to follow the
 * machine.
 *
 * @remarks
 *   Removing rather than writing the resolved mode is what lets the stylesheet decide. Its rules
 *   draw a page carrying no attribute by the machine's own setting, so a person following the
 *   machine keeps following it when they change it, without this running again.
 *   The document is read without a guard because this runs from a layout effect, and one runs
 *   nowhere that has no document.
 */
function apply(choice: ColorModeChoice): void {
  const root = document.documentElement;

  if (choice === "system") root.removeAttribute(COLOR_MODE_ATTRIBUTE);
  else root.setAttribute(COLOR_MODE_ATTRIBUTE, choice);
}

/**
 * Puts a colour mode in scope for everything below, and remembers which one.
 *
 * @remarks
 *   The choice is written on the document root rather than on an element of its own, so a portal
 *   drawn at the end of the document is in the same mode as the tree that opened it. A subtree
 *   drawn the other way writes the attribute on its own element and needs nothing from here.
 *   The attribute is written in a layout effect, which runs before the browser paints the commit,
 *   so a page whose provider mounts without the inline script is never painted in the wrong mode
 *   by React itself. What was painted before React mounted is the script's to settle.
 *   The definition is memoised against the store rather than left to the compiler, because a
 *   reader is subscribed by the identity of the definition it was built from. A fresh one each
 *   render would drop and rebuild the subscription each render.
 * @returns The page, with the mode in scope.
 */
export function ColorModeProvider({ app, children, store }: ColorModeProviderProps): ReactElement {
  const setting = useMemo(() => colorModeSetting(store), [store]);
  const [choice, setColorMode] = useSetting(app, setting);
  const system = useSystemColorMode();
  const colorMode = choice === "system" ? system : choice;

  useLayoutEffect(() => {
    apply(choice);
  }, [choice]);

  return (
    <ColorModeContext value={{ choice, colorMode, setColorMode }}>{children}</ColorModeContext>
  );
}
