/**
 * Resolving a workspace package to its source rather than to a `dist` it has not built yet.
 */

import { defaultClientConditions, defaultServerConditions } from "vite-plus";

import { type Preset, preset } from "#core/layer.ts";
import { SOURCE } from "#resolve/condition.ts";

/**
 * Reads every workspace package as source.
 *
 * A package in a workspace exports two things under one name: its built entry, and the source that
 * entry is built from. Which one a caller gets is decided by a condition, and this sets it — so a
 * clean checkout type-checks and tests before anything has been built, an edit is seen by the
 * package importing it without a rebuild, and going to a definition arrives at the file to change.
 *
 * Not split by environment, and so not among this block's presets: the condition is the same
 * wherever the package runs. Both resolvers are set because they are separate — `resolve` reaches
 * the browser's and `ssr.resolve` the one node runs under, which is the one a specification loads a
 * sibling package through.
 *
 * Vite's own conditions are kept, because setting this key replaces the list rather than extending
 * it, and a package shipping separate browser and node entries would start resolving to the wrong
 * one.
 *
 * @returns The preset.
 */
export function source(): Preset {
  return preset({
    config: {
      resolve: { conditions: [SOURCE, ...defaultClientConditions] },
      ssr: { resolve: { conditions: [SOURCE, ...defaultServerConditions] } },
    },
    name: `resolve.source(${SOURCE})`,
  });
}
