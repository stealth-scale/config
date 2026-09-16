/**
 * Declares React and its renderer as singletons for a federated application to share.
 */

import { createRequire } from "node:module";

import { type federation } from "@stealthscale/vite-config";

/**
 * The packages a page may only ever hold one copy of.
 */
const SINGLETONS = ["react", "react-dom"];

/**
 * Reads the version of the React a build resolves.
 *
 * @remarks
 *   The version comes from the tree rather than from a constant here, so a major upgrade needs no
 *   edit in this package.
 * @param read - Loads React's manifest. The default reads the copy installed beside this package,
 *   and a test passes its own.
 * @returns The version string the manifest declares.
 * @throws {@link TypeError} When the manifest carries no version string, which is what a missing
 *   peer looks like from here.
 */
export function installed(
  read: () => unknown = () => createRequire(import.meta.url)("react/package.json"),
): string {
  const held: unknown = read();
  const version: unknown =
    typeof held === "object" && held !== null ? Reflect.get(held, "version") : undefined;

  if (typeof version !== "string") {
    throw new TypeError(
      "react.federation.shared() could not read React's version from its own manifest. React is a " +
        "peer of this package, and sharing it between applications needs the one that is installed.",
    );
  }

  return version;
}

/**
 * Widens a version to the whole major it belongs to.
 *
 * @remarks
 *   Two applications on different patches of one major share a dispatcher safely, and a narrower
 *   range would make the host refuse a remote it can in fact run.
 */
function same(version: string): string {
  return `^${version.replace(/\..*$/u, "")}.0.0`;
}

/**
 * Marks React and its renderer as singletons, both at the range of the installed major.
 *
 * @remarks
 *   Two copies of React on one page keep separate dispatchers, so a component from a remote calling
 *   a hook reaches the copy that did not render it and React reports the call as illegal. A
 *   singleton is what makes the host and its remotes agree on one copy.
 * @param version - The React version to widen. Reading the installed one is what a caller wants
 *   unless a test is pinning the result.
 * @throws {@link TypeError} When no version is passed and React's manifest carries none.
 */
export function shared(version: string = installed()): federation.Shared {
  const requiredVersion = same(version);

  return Object.fromEntries(
    SINGLETONS.map((named) => [named, { requiredVersion, singleton: true }]),
  );
}
