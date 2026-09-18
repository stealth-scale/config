/**
 * Reads the way the machine asks for a page to be drawn.
 */

import { useSyncExternalStore } from "react";

import { type ColorMode } from "@stealthscale/theme";

import { DARK_SCHEME_QUERY } from "#setting.ts";

/**
 * Starts telling a reader when the machine's setting changes.
 *
 * @returns How to stop listening.
 */
function subscribe(onChange: () => void): () => void {
  const query = globalThis.matchMedia?.(DARK_SCHEME_QUERY);

  query?.addEventListener("change", onChange);

  return () => {
    query?.removeEventListener("change", onChange);
  };
}

/**
 * Reads the machine's setting.
 *
 * @returns `dark` where the machine asks for it, and `light` where it does not or cannot say.
 */
function read(): ColorMode {
  return globalThis.matchMedia?.(DARK_SCHEME_QUERY).matches ? "dark" : "light";
}

/**
 * Reads what a server would say, which is `light`.
 *
 * @remarks
 *   A server has no reader and cannot know. The stylesheet draws a page that writes no attribute
 *   by the machine's own setting, so nothing about the first paint rests on this answer. It is
 *   what a component reads while it decides something no rule can decide, such as which image to
 *   show.
 */
function onServer(): ColorMode {
  return "light";
}

/**
 * Reads the way the machine asks for a page to be drawn, and follows it as it changes.
 *
 * @returns `dark` or `light`, never what a person chose.
 */
export function useSystemColorMode(): ColorMode {
  return useSyncExternalStore(subscribe, read, onServer);
}
