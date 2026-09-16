/**
 * Publishes the mapping a server needs to find a hashed file by its source name.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Records which built file each source entry became, along with what that file pulls in.
 *
 * @remarks
 *   A file name carries a content hash and therefore changes whenever the file does. Anything
 *   outside the bundle that has to reference one — a server rendering the document, a template in
 *   another language — reads the name out of this file rather than guessing it.
 */
export function manifest(): Preset {
  return preset({ config: { build: { manifest: true } }, name: "build.manifest" });
}
