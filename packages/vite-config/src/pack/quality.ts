/**
 * What a package is checked against before it is published.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * The subpaths a type checker has nothing to say about.
 *
 * `attw` resolves every published subpath as a module and reports the ones whose types it cannot
 * reach. A stylesheet has none to reach: it is an asset a bundler loads, the packer exports it
 * because it emitted it, and no declaration was ever going to sit beside it. Reported as a failure
 * it is noise, and noise on this check is what stops anybody reading the rest of it.
 *
 * `publint` still checks these, which is the half that matters for an asset — that the file the
 * subpath names is one the tarball holds.
 */
const UNTYPED = [/\.css$/u];

/**
 * Checks the package the way the ecosystem will, before anybody installs it.
 *
 * Two checks, both off by the packer's own default, both about the manifest rather than the code.
 * `publint` reads it the way a package manager does: an export pointing at a file that is not
 * shipped, a `main` that disagrees with `exports`, a condition in the wrong order. `attw` resolves
 * the types the way each module system does, which is the one that catches a package whose types
 * work under one resolution and vanish under another.
 *
 * Neither can be run by a consumer on a package they did not publish, and neither shows up in a
 * repository's own tests, because every one of them imports by a path the packer has not written
 * yet. This is the only place the mistake is visible.
 *
 * @returns The preset.
 */
export function quality(): Preset {
  return preset({
    config: { pack: { attw: { excludeEntrypoints: UNTYPED }, publint: true } },
    name: "pack.quality",
  });
}
