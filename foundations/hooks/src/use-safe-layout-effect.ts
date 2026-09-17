/**
 * Runs a layout effect in a browser and nothing at all where there is no document.
 */

import { useEffect, useLayoutEffect } from "react";

/**
 * Picks the layout effect for a browser and the plain effect for a server.
 *
 * @remarks
 *   Taken as an argument rather than read from the global, so both answers are reachable from a
 *   specification running in one environment.
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
 *   `useLayoutEffect` is what stops a component that positions itself from being seen in the wrong
 *   place first. On a server there is nothing to measure and nothing to paint, and React warns
 *   about the call rather than skipping it, so what is named there is the effect that never runs.
 *   The choice is made once, when the module loads, because a document does not appear partway
 *   through a process.
 */
export const useSafeLayoutEffect: typeof useLayoutEffect = layoutEffect(globalThis.document);
