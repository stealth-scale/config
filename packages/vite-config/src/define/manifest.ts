/**
 * The constants a package can read about itself.
 */

import { type Preset, preset } from "@stealthscale/vite-config-core";

/**
 * Describes which constants a package wants beyond the two it always gets.
 */
export interface Injected {
  /**
   * Injects `__BUILT_AT__`, the moment the build ran, as an ISO 8601 string.
   *
   * Off by default, and worth leaving off. A timestamp differs on every run, so the output of two
   * builds of the same source differs too — which defeats a build cache and makes a release
   * impossible to reproduce byte for byte.
   */
  builtAt?: boolean | undefined;

  /**
   * Injects `__COMMIT__`, the revision the build ran against.
   *
   * Off by default because it is not always knowable: a build from a published tarball has no
   * repository to ask, and the value is then the empty string.
   */
  commit?: boolean | undefined;
}

/**
 * Reads the revision the build is running against.
 *
 * @param env - The variables in force, as `Context` carries them.
 * @returns The commit, or an empty string where there is no repository to ask.
 */
function commitOf(env: Readonly<Record<string, string>>): string {
  return env["GITHUB_SHA"] ?? env["CI_COMMIT_SHA"] ?? "";
}

/**
 * Injects what a package's own manifest says about it, as constants it can read at run time.
 *
 * `__NAME__` and `__VERSION__` come from the package's own manifest, which is the only copy of
 * either — so an error report, a cache key or a support question names a build without anybody
 * keeping a second version string in step with the first.
 *
 * These are substitutions rather than variables: the token is replaced wherever it appears,
 * including inside a string literal, which is why each is spelled unmistakably. The declarations
 * that make them type-check ship beside this package as `globals.d.ts`, and a specification asserts
 * the two lists agree.
 *
 * @param injected - The constants beyond the two always given. `Injected` documents every member.
 * @returns The preset.
 */
export function manifest(injected: Injected = {}): Preset {
  return preset({
    config: (context) => {
      const held: Record<string, string> = {
        __NAME__: JSON.stringify(context.manifest.name ?? ""),
        __VERSION__: JSON.stringify(context.manifest.version ?? ""),
      };

      if (injected.commit === true) held["__COMMIT__"] = JSON.stringify(commitOf(context.env));
      if (injected.builtAt === true) {
        held["__BUILT_AT__"] = JSON.stringify(new Date().toISOString());
      }

      return { define: held };
    },
    name: `define.manifest${asked(injected)}`,
  });
}

/**
 * Spells the constants asked for beyond the two always given, so the name carries the call.
 *
 * @param injected - The constants asked for.
 * @returns The parenthesised list, or nothing where nothing beyond the two was asked for.
 */
function asked(injected: Injected): string {
  const held = [
    injected.commit === true ? "commit" : "",
    injected.builtAt === true ? "builtAt" : "",
  ].filter((one) => one !== "");

  return held.length === 0 ? "" : `(${held.join(", ")})`;
}
