/**
 * Sends the response headers a preview server shares with a deployment.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * The headers a preview server answers every request with.
 */
const ANSWERED = {
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
};

/**
 * Answers a preview request with the three headers that need no knowledge of a
 * deployment.
 *
 * @remarks
 *   A Content-Security-Policy and an HSTS max-age both depend on the origin a
 *   deployment runs at. Guessing either here gives a preview that passes and a
 *   deployment that does not, so both are left to whoever knows the origin. The
 *   table is copied into the layer, and a caller mutating the result reaches
 *   its own copy.
 * @returns A layer holding its own copy of the headers.
 */
export function headers(): Preset {
  return preset({ config: { preview: { headers: { ...ANSWERED } } }, name: "preview.headers" });
}
