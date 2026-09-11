/**
 * An application that hands modules to another one at run time.
 */

import { federation } from "@module-federation/vite";

import { contribute, type Contribution } from "@stealthscale/config-core";

import { ENTRY, type Exposed, type Shared } from "#federation/settings.ts";

/**
 * Describes what an application exposes.
 */
export interface Remoted {
  /**
   * What it hands over, each against the module behind it.
   */
  exposes: Exposed;

  /**
   * What it is called. A host writes this name in front of every module it imports from here.
   */
  name: string;

  /**
   * What it loads from its host rather than bundling. React and its renderer belong here for
   * anything that renders, because two copies of React in one page share no hooks.
   */
  shared?: Shared;
}

/**
 * Hands the named modules to whatever loads this application.
 *
 * What separates this from publishing a package is when the two are joined: a package is chosen at
 * install time and built into whoever installed it, and a remote is fetched at run time from
 * wherever it is deployed. The applications are then released apart, which is the whole reason to
 * do it and the whole cost of it.
 *
 * The entry is emitted unhashed at `remoteEntry.js`. Everything else the plugin writes is hashed,
 * which a host reaches through the entry rather than by knowing.
 *
 * Types are not generated. The plugin can compile a remote's types and serve them for a host to
 * fetch, which needs the remote running while the host is built and puts a network call inside a
 * type check. A repository that wants it says so.
 *
 * `build.served` belongs beside this. A remote's chunks are fetched by a page it did not serve, so
 * its URLs have to be absolute or they resolve against the host.
 *
 * @param stated - The name and the modules. `Remoted` documents every member.
 * @returns The contribution the bundler builds the entry from.
 */
export function remote(stated: Remoted): Contribution {
  return contribute({
    at: "plugins",
    because: "another application loads these modules at run time rather than installing them",
    item: federation({
      dts: false,
      exposes: { ...stated.exposes },
      filename: ENTRY,
      name: stated.name,
      shared: { ...stated.shared },
    }),
    name: `federation.remote(${stated.name})`,
  });
}
