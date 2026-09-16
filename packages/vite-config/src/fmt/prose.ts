/**
 * How a paragraph outside code is wrapped.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Rewraps a paragraph to the width the rest of the repository is written to.
 *
 * @remarks
 *   The width is the one code uses. A paragraph left as it was typed keeps
 *   whatever width its author's editor happened to be set to, and two files
 *   then disagree without either being wrong.
 */
export function prose(): Preset {
  return preset({ config: { fmt: { proseWrap: "always" } }, name: "fmt.prose" });
}
