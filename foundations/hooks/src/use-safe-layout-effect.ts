/**
 * Runs a layout effect in a browser and nothing at all where there is no document.
 */

import { useEffect, useLayoutEffect } from "react";

/**
 * Picks the layout effect for a browser and the plain effect for a server.
 *
 * @remarks
 *   The document is taken as an argument rather than read from the global, so a specification
 *   running in one environment can reach both branches.
 * @param document - The document, or nothing where the code runs outside a browser.
 * @returns The hook to call, which does nothing before paint where there is no document.
 */
export function layoutEffect(document?: Document): typeof useLayoutEffect {
  return document === undefined ? useEffect : useLayoutEffect;
}

/**
 * Measures and writes before the browser paints, and does nothing on a server.
 *
 * @remarks
 *   `useLayoutEffect` runs before the paint, so a component that positions itself is never drawn in
 *   the wrong place first. A server has nothing to measure and nothing to paint, and React logs a
 *   warning for `useLayoutEffect` there rather than skipping the call, so the fallback is
 *   `useEffect`, which React does not run on a server. The choice is made once, when the module
 *   loads, because a document does not appear partway through a process.
 */
export const useSafeLayoutEffect: typeof useLayoutEffect = layoutEffect(globalThis.document);
