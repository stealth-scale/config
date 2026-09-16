/**
 * Which dependencies a server build compiles rather than leaves to the runtime.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

/**
 * Where a contribution to the list of what is not externalised is appended.
 */
const AT = "ssr.noExternal";

/**
 * Describes dependencies a server build has to compile itself.
 */
export interface Bundled {
  /**
   * Why node cannot load it as it stands, kept with the contribution so a later reader can weigh
   * it.
   */
  because: string;

  /**
   * The packages, each by name.
   */
  deps: readonly string[];
}

/**
 * Compiles a dependency into the server build rather than importing it at run time.
 *
 * A server build leaves every dependency out and lets node import it, which is right for the ones
 * node can read. A package that ships something node cannot is the exception, and the two that come
 * up are the same two every time: source that was never compiled, and a stylesheet. Node has no
 * answer for `import "./panel.css"`, because it is not a module, so the import throws the moment
 * the server reaches it.
 *
 * A workspace package is bundled already, because the dev server resolves it to its own source and
 * treats it as linked. What this is for is the same package once it is installed from a registry
 * rather than linked, where nothing marks it out and its stylesheet stops the server.
 *
 * One contribution per package, each named for the package it carries, so a later module can take
 * back exactly one rather than the set.
 *
 * @param stated - The packages, and why node cannot load them.
 * @returns One contribution for each package.
 */
export function bundle(stated: Bundled): readonly Contribution[] {
  return stated.deps.map((held) =>
    contribute({ at: AT, because: stated.because, item: held, name: `ssr.bundle(${held})` }),
  );
}
