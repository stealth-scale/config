/**
 * Ships the licence notices of the code a bundle absorbed.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Collects the licence of every dependency the bundle drew from into a file beside it.
 *
 * @remarks
 *   A bundle carries other people's code with the attribution stripped out by minification, and
 *   most licences require the notice to travel with the code. The collected file is what satisfies
 *   that.
 */
export function licences(): Preset {
  return preset({ config: { build: { license: true } }, name: "build.licences" });
}
