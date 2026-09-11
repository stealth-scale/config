/**
 * Keeping a stack trace readable without handing the source to everybody who asks.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Emits source maps the bundle does not point at.
 *
 * A build with no maps answers every production stack trace with a column in a minified line, which
 * is the moment the trace stops being evidence. Emitting them is what makes an error report worth
 * reading a month later.
 *
 * Hidden rather than plain: the map is written beside the bundle but no `sourceMappingURL` comment
 * points at it, so a browser does not fetch it and a reader opening the deployed file does not get
 * the source. What does read it is whatever the maps were uploaded to, which is the only thing that
 * needed them.
 *
 * @returns The preset.
 */
export function sourcemaps(): Preset {
  return preset({ config: { build: { sourcemap: "hidden" } }, name: "build.sourcemaps" });
}
