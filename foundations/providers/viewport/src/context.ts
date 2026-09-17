/**
 * Carries the width a subtree is laid out for, and reads it back.
 */

import { createContext, useContext } from "react";

import { type Size, sizesOf } from "#size.ts";

/**
 * Describes what {@link useViewport} answers.
 */
export interface ViewportContextValue {
  /**
   * Lays the subtree out for a width from now on, or for the window again given nothing.
   */
  setWidth: (width: number | undefined) => void;

  /**
   * Every width on offer, narrowest first.
   */
  sizes: readonly Size[];

  /**
   * The width stated, in pixels, or nothing where the window decides.
   */
  width: number | undefined;
}

/**
 * Carries what the nearest provider above settled on.
 */
export const ViewportContext = createContext<undefined | ViewportContextValue>(undefined);

/**
 * Leaves the window to decide, which is all there is to do outside a provider.
 */
function unstated(): void {
  return undefined;
}

/**
 * Reads the width the subtree is laid out for, the widths on offer, and how to change it.
 *
 * @remarks
 *   Outside a provider the window decides: the width is nothing, the sizes are the theme's, and
 *   setting a width changes nothing. Answering rather than throwing is what lets every breakpoint
 *   hook ask without a provider above it, which is the common case for an application that lays
 *   out against the browser.
 * @returns The width, the sizes on offer, and how to change it.
 */
export function useViewport(): ViewportContextValue {
  const stated = useContext(ViewportContext);

  return stated ?? { setWidth: unstated, sizes: sizesOf(), width: undefined };
}
