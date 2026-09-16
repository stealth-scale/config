/**
 * Emptying the document a rendering test drew into.
 */

import { createRequire } from "node:module";

import { contribute, type Contribution } from "@stealthscale/vite-config";

/**
 * Where a contribution to the list of setup files lands.
 */
const AT = "test.setupFiles";

/**
 * The file the runner loads, resolved through this package's own name.
 *
 * A setup file is resolved against the repository being tested rather than against this package, so
 * the path has to be absolute by the time the runner reads it. Resolved by name rather than by a
 * relative path, because the two differ: this module sits one directory deeper in `src` than the
 * file it compiles to in `dist`, and the export map is the one thing that answers the same from
 * both.
 */
const SETUP = createRequire(import.meta.url).resolve(
  "@stealthscale/vite-config-react/vitest.setup.ts",
);

/**
 * Empties the document after every test.
 *
 * A test that mounts a component leaves it mounted. The next one then reads a document holding
 * somebody else's markup, and a query that should find one node finds two — or passes for the wrong
 * reason. The runner puts mocks and globals back on its own and says nothing about the document,
 * because the document only exists where a tier asked for one.
 *
 * What this does not do is unmount the roots, so an effect's cleanup does not run. Removing the
 * nodes is enough to stop one test reading another's markup, which is the fault that actually
 * happens; a repository that tests cleanup itself reaches for a testing library and takes this back
 * by name.
 *
 * @returns The contribution.
 */
export function cleanup(): Contribution {
  return contribute({
    at: AT,
    because: "a mounted component outlives the test that mounted it",
    item: SETUP,
    name: "react.test.cleanup",
  });
}
