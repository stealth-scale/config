/**
 * How many files the code a page loads first is written to.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Matches the React runtime, which is what an application changes least often.
 */
const FRAMEWORK = /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/u;

/**
 * Matches every other package.
 */
const VENDOR = /[\\/]node_modules[\\/]/u;

/**
 * Writes what the entry reaches statically to three chunks, by how often each changes: the React
 * runtime, the other packages, and the application.
 *
 * Nothing in a module entry runs until its whole static import graph has arrived, so the number of
 * files that graph is split into can only add requests, never let anything start earlier. Left to
 * itself the bundler writes one file per module that two chunks share, which on an application of
 * any size is a hundred files, most under a kilobyte, each compressed on its own and each named in
 * a preload hint the page parses before its first byte of script. Measured on the design system's
 * docs: 119 files at 396 kB gzipped against three at 349 kB, the difference being what compressing
 * each file alone loses.
 *
 * Three rather than one, so a returning visitor fetches again only what changed: a deploy of the
 * application leaves the packages' hashes alone, and a dependency bump leaves React's. Nothing the
 * page loads lazily is touched: the tag names only what the entry reaches statically, and a route
 * or a page behind a dynamic import stays a chunk of its own.
 *
 * Not grouped per entry. That option counts every lazily loaded chunk as an entry, so an
 * application with many of them comes out with more initial files than it started with: 126
 * preload hints on the docs, against 3. And the captured modules' dependencies are left included,
 * as the bundler has them: what the entry reaches statically reaches its dependencies the same
 * way, so leaving them out changes nothing here and is what the bundler warns produces invalid
 * chunks elsewhere.
 *
 * @returns The preset.
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
