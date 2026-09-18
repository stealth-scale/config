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
 * The value a reader outside every provider reads, built on first use.
 */
let fallback: undefined | ViewportContextValue;

/**
 * Returns what a reader outside every provider reads: the window deciding, and the design
 * system's own sizes.
 *
 * @remarks
 *   One object, however many readers and renders, so a reader outside a provider reads the same
 *   value each render and nothing built from it is rebuilt.
 */
function windowed(): ViewportContextValue {
  fallback ??= { setWidth: unstated, sizes: sizesOf(), width: undefined };

  return fallback;
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
  return useContext(ViewportContext) ?? windowed();
}
