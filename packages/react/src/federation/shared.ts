/**
 * What two federated applications have to agree on before either renders.
 */

import { createRequire } from "node:module";

import { type federation } from "@stealthscale/config-vite";

/**
 * The packages a host and its remotes must load exactly one copy of.
 */
const SINGLETONS = ["react", "react-dom"];

/**
 * Reads the version of React this workspace installed.
 *
 * Resolved rather than named, for the same reason the stylelint package resolves its shared config:
 * the answer has to come from the tree the configuration is running in. React is a peer of this
 * package, so the copy found here is the copy the application will load.
 *
 * Which manifest it reads is an argument so that the failure a repository without React meets is
 * reachable from a specification here, where React is installed.
 *
 * @param read - How to reach React's manifest. Its own unless a specification says otherwise.
 * @returns The version, as that manifest states it.
 * @throws TypeError Where the manifest states no version, which a repository federating React
 *   without React installed is what produces.
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
 * Widens a version to the range that counts as the same React.
 *
 * The major, because that is the boundary React treats as breaking. Narrower would refuse a host on
 * a later patch than the remote was built against, which is every deployment eventually.
 *
 * @param version - The installed version.
 * @returns The range.
 */
function same(version: string): string {
  return `^${version.replace(/\..*$/u, "")}.0.0`;
}

/**
 * The packages a host and its remotes must load exactly one copy of.
 *
 * Two copies of React in one page do not share hooks. Each keeps its own dispatcher, so a component
 * from the remote calling `useState` reaches the copy that did not render it, and React reports
 * that hooks may only be called inside a function component — which is true, and says nothing about
 * what is wrong.
 *
 * `react-dom` for the same reason one level down: two renderers mean two roots competing for the
 * same tree, and context crosses neither.
 *
 * Named here rather than in each application because the answer is React's rather than any
 * application's, and because a host and a remote disagreeing about it is the failure this exists to
 * prevent — one list, imported by both, cannot disagree with itself.
 *
 * @param version - The installed React. Read from the tree unless a specification says otherwise.
 * @returns The shared packages, ready to hand to `federation.host` or `federation.remote`.
 */
export function shared(version: string = installed()): federation.Shared {
  const requiredVersion = same(version);

  return Object.fromEntries(
    SINGLETONS.map((named) => [named, { requiredVersion, singleton: true }]),
  );
}
