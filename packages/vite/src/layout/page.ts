/**
 * Where an application's page sits, and everything that follows from it.
 */

import { type Preset, preset } from "#core/layer.ts";

/**
 * Where a build is written, named from outside the root so it is never written inside it.
 */
const OUT = "dist";

/**
 * Roots an application at the directory holding its page.
 *
 * Only an application needs this. A library has no page, and rooting one at a directory it does not
 * have would stop it building at all, which is why this is asked for rather than assumed.
 *
 * Three things follow from moving the root, and all three are settled here rather than left for a
 * repository to discover. A build is written relative to the root, so it would land inside the
 * directory it was built from. `publicDir` is read relative to the root, so it would point at a
 * directory below the page rather than beside it. And the test runner takes the same root, so it
 * would look for specifications in the one directory that holds none.
 *
 * What a page refers to by an absolute path is resolved from the root as well, so a script tag
 * reaching source outside it is written as a relative path. That is the one thing left to the
 * author, because only the page says where its source is.
 *
 * @param at - The directory holding the page, relative to the package.
 * @returns The preset.
 */
export function page(at: string): Preset {
  const depth = at.split("/").filter(Boolean).length;

  return preset({
    config: {
      build: { emptyOutDir: true, outDir: `${"../".repeat(depth)}${OUT}` },
      publicDir: false,
      root: at,
      test: { root: "." },
    },
    name: `layout.page(${at})`,
  });
}
