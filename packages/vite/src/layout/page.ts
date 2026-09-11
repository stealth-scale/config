/**
 * Where an application's page sits.
 */

import { type Preset, preset } from "#core/layer.ts";

/**
 * Builds an application from the page in the directory it names.
 *
 * Only an application needs this. A library has no page, which is why it is asked for rather than
 * assumed.
 *
 * The page is named as a build input rather than by moving the project root to the directory
 * holding it, and the difference matters more than it looks. The root is what every other tool
 * resolves against: the test runner takes it as the directory to look for specifications in, the
 * output directory is written relative to it, and `publicDir` is read below it. Moving it to house
 * a page means putting each of those back by hand, and the one the runner takes cannot be put back
 * by a configuration package at all — it would have to be an absolute path, which only the
 * repository knows.
 *
 * The page keeps its directory in the output, so a build writes `dist/<at>/index.html` rather than
 * `dist/index.html`. That is a fact about where a deployment points, and it is the cheaper thing to
 * settle: whatever serves the build names a directory, while a test runner looking in the wrong
 * place reports that a package has no tests.
 *
 * Nothing here touches `publicDir`, and the directory named must not be the one it reads. Those two
 * sentences are the same sentence: `public` already means the files a build copies out untouched,
 * so a page put there is copied over the built one unprocessed, and the only way out of that is to
 * turn the copying off — which leaves an application unable to ship a `favicon.ico` or a
 * `robots.txt` at all, silently. Named apart, each directory means what it means everywhere else.
 *
 * @param at - The directory holding the page, relative to the package. Not `public`, which is where
 *   the files a build copies out untouched already live.
 * @returns The preset.
 * @throws Error Where the directory named is the one `publicDir` reads.
 */
export function page(at: string): Preset {
  if (at === "public") {
    throw new Error(
      "layout.page(public) would put the page where the files a build copies out untouched live, " +
        "so the copy would land on top of the built page. Name the page's own directory, and " +
        "leave `public` to the assets.",
    );
  }

  return preset({
    config: { build: { rolldownOptions: { input: `${at}/index.html` } } },
    name: `layout.page(${at})`,
  });
}
