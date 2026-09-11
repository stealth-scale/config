/**
 * The constants a package can read about itself.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";

import { type Preset, preset } from "@stealthscale/config-core";

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
 * Reads one text field out of the manifest beside a config.
 *
 * @param at - The directory holding it.
 * @param field - Which field to read.
 * @returns The field's value, or an empty string where there is nothing to read.
 */
function read(at: string, field: string): string {
  try {
    const held: unknown = JSON.parse(readFileSync(join(at, "package.json"), "utf8"));
    const value: unknown =
      typeof held === "object" && held !== null ? Reflect.get(held, field) : undefined;

    return typeof value === "string" ? value : "";
  } catch {
    return "";
  }
}

/**
 * Reads the revision the build is running against.
 *
 * @returns The commit, or an empty string where there is no repository to ask.
 */
function commitOf(): string {
  return process.env["GITHUB_SHA"] ?? process.env["CI_COMMIT_SHA"] ?? "";
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
 * @param at - The directory the package lives in, which is `import.meta.dirname`. Only the config
 *   being loaded knows where it sits.
 * @param injected - The constants beyond the two always given. `Injected` documents every member.
 * @returns The preset.
 */
export function manifest(at: string, injected: Injected = {}): Preset {
  const held: Record<string, string> = {
    __NAME__: JSON.stringify(read(at, "name")),
    __VERSION__: JSON.stringify(read(at, "version")),
  };

  if (injected.commit === true) held["__COMMIT__"] = JSON.stringify(commitOf());
  if (injected.builtAt === true) held["__BUILT_AT__"] = JSON.stringify(new Date().toISOString());

  return preset({ config: { define: held }, name: "define.manifest" });
}
