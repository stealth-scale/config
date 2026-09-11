/**
 * Putting a manifest's keys in the order everybody already expects them.
 */

import { type Preset, preset } from "#core/layer.ts";

/**
 * Sorts every `package.json` into the conventional order.
 *
 * A manifest has a reading order the ecosystem settled on years ago — what the package is, then
 * where it came from, then what it ships, then what it needs — and a key added by hand lands
 * wherever the hand was. Sorting it means a diff shows a dependency changing rather than a file
 * being reshuffled, and two manifests in one workspace can be read side by side.
 *
 * On by the formatter's own default, and stated anyway: this one rewrites a file that is also the
 * package's published contract, so it is worth being a decision rather than something inherited.
 *
 * @returns The preset.
 */
export function manifests(): Preset {
  return preset({ config: { fmt: { sortPackageJson: true } }, name: "fmt.manifests" });
}
