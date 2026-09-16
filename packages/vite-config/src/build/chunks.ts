/**
 * Decides which chunk each module of an application bundle lands in.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Matches the rendering runtime, wherever the package manager happened to put it.
 *
 * @remarks
 *   The pattern looks for a `node_modules` segment rather than a prefix, because pnpm stores a
 *   package under `.pnpm` and links it back in. Matching a prefix would miss every one of them.
 */
const FRAMEWORK = /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/u;

/**
 * Matches everything else that came from the registry.
 */
const VENDOR = /[\\/]node_modules[\\/]/u;

/**
 * Splits a bundle three ways: the rendering runtime, the rest of the dependencies, the application.
 *
 * @remarks
 *   Priority decides which group claims a module, not the order the groups are written in, so the
 *   framework pattern is consulted before the vendor pattern that also matches it. Only what an
 *   entry reaches statically is grouped, which leaves a lazily imported module in a chunk of its
 *   own and a route that is never visited undownloaded.
 */
export function chunks(): Preset {
  return preset({
    config: {
      build: {
        rolldownOptions: {
          output: {
            codeSplitting: {
              groups: [
                { name: "framework", priority: 10, tags: ["$initial"], test: FRAMEWORK },
                { name: "vendor", priority: 5, tags: ["$initial"], test: VENDOR },
                { name: "app", tags: ["$initial"] },
              ],
            },
          },
        },
      },
    },
    name: "build.chunks",
  });
}
