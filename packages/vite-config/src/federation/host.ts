/**
 * Lets an application import modules that another deployment serves.
 *
 * @remarks
 *   A host records the name of each remote and nothing about where it lives. The
 *   address is registered at run time, so one build runs against any deployment
 *   of the remotes it names.
 */

import { contribute, type Layer, preset } from "@stealthscale/vite-config-core";

import { plugged } from "#federation/plugged.ts";
import { type Remotes, type Shared, UNSET } from "#federation/settings.ts";

/**
 * Declares which remotes an application imports from, and on what terms.
 */
export interface Hosted {
  /**
   * Identifies this application to the federation runtime.
   */
  name: string;

  /**
   * Lists each remote this application imports from, by name alone.
   */
  remotes?: Remotes | undefined;

  /**
   * Declares which dependencies a remote is expected to reuse from this host.
   */
  shared?: Shared;

  /**
   * Maps a specifier imported from a remote to a local module, keyed as the import writes it.
   */
  stubs?: Readonly<Record<string, string>> | undefined;
}

/**
 * Adds the plugins that resolve a remote import, and an alias for each stand-in.
 *
 * @remarks
 *   Every remote starts out pointed at an address that resolves nowhere, and
 *   registration replaces it. The stand-ins reach the test runner alone, which
 *   has no deployment to fetch a remote from.
 * @returns One layer, and a second holding the stand-in aliases when any were named.
 */
export function host(stated: Hosted): readonly Layer[] {
  const held = contribute({
    at: "plugins",
    because: "these modules are fetched from another deployment rather than built into this one",
    itemOf: () =>
      plugged({
        dts: false,
        hostInitInjectLocation: "entry",
        name: stated.name,
        remotes: Object.fromEntries(
          (stated.remotes ?? []).map((named) => [
            named,
            { entry: `${UNSET}/${named}/remoteEntry.js`, name: named, type: "module" },
          ]),
        ),
        shared: { ...stated.shared },
      }),
    name: `federation.host(${stated.name})`,
  });

  if (stated.stubs === undefined) return [held];

  return [
    held,
    preset({
      config: { test: { alias: { ...stated.stubs } } },
      name: `federation.host(${stated.name}).stubs`,
    }),
  ];
}
