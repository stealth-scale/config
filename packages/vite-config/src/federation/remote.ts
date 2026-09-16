/**
 * Turns a package into a remote that other applications load over the network.
 *
 * @remarks
 *   A remote is fetched rather than installed, so its entry keeps a stable
 *   filename and its shared dependencies have to be declared on both sides of
 *   the boundary.
 */

import { contribute, type Contribution } from "@stealthscale/vite-config-core";

import { plugged } from "#federation/plugged.ts";
import { ENTRY, type Exposed, type Shared } from "#federation/settings.ts";

/**
 * Describes what a package publishes when it is built as a remote.
 */
export interface Remoted {
  /**
   * Maps each specifier a host may import to the module behind it.
   */
  exposes: Exposed;

  /**
   * Identifies the remote to every host, and cannot change once a host names it.
   */
  name: string;

  /**
   * Declares which dependencies this remote takes from its host instead of bundling.
   */
  shared?: Shared;
}

/**
 * Adds the plugins that build a package into a loadable remote.
 *
 * @remarks
 *   The plugin package is resolved when the configuration is evaluated rather
 *   than when this returns, so a repository holding an unused remote layer never
 *   pays for the optional peer.
 * @returns A layer named for the remote, so a repository can take it back.
 */
export function remote(stated: Remoted): Contribution {
  return contribute({
    at: "plugins",
    because: "another application loads these modules at run time rather than installing them",
    itemOf: () =>
      plugged({
        dts: false,
        exposes: { ...stated.exposes },
        filename: ENTRY,
        name: stated.name,
        shared: { ...stated.shared },
      }),
    name: `federation.remote(${stated.name})`,
  });
}
