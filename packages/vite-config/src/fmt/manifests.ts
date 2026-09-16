/**
 * The key order a package manifest is written in.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Rewrites a package manifest into the conventional key order.
 *
 * @remarks
 *   Two people adding a dependency by hand put it in two different places. The
 *   sort settles that before either change reaches a review.
 */
export function manifests(): Preset {
  return preset({ config: { fmt: { sortPackageJson: true } }, name: "fmt.manifests" });
}
