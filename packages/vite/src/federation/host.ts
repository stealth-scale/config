/**
 * An application that loads modules from another one at run time.
 */

import { federation } from "@module-federation/vite";

import { contribute, type Layer, preset } from "#core/layer.ts";
import { type Remotes, type Shared, UNSET } from "#federation/settings.ts";

/**
 * Describes what an application loads.
 */
export interface Hosted {
  /**
   * What it is called.
   */
  name: string;

  /**
   * Each remote it loads, against the URL that remote's entry is served from.
   *
   * Absent where the endpoints are not known when the build runs, which is the usual case for
   * anything deployed more than once: a URL written here is compiled in, so the same build cannot
   * be promoted from one environment to the next. A host that leaves this out registers its remotes
   * at run time instead, from configuration its deployment serves.
   */
  remotes?: Remotes | undefined;

  /**
   * What it hands to its remotes rather than letting each bring a copy. React and its renderer
   * belong here for anything that renders, because two copies of React in one page share no hooks.
   */
  shared?: Shared;

  /**
   * Each name imported from a remote, against what stands in for it while the tests run.
   *
   * As absolute paths. The runner reads a relative one against whatever it happens to be rooted at,
   * which is not this package, so `join(import.meta.dirname, ...)` is how these are written.
   */
  stubs?: Readonly<Record<string, string>> | undefined;
}

/**
 * Loads the named applications at run time.
 *
 * The host is the one that owns the page, so it is the one that decides what is shared: a remote
 * asking for a singleton gets the host's copy, and brings its own only where the host offers none.
 * That ordering is why the two lists have to agree on a version range, and why a mismatch shows up
 * as a second React rather than as an error.
 *
 * A name here and a URL are two different commitments, and only the first is a build's to make. The
 * bundler has to know the name: `remote/Thing` is resolved while the application is built, and a
 * name that was never declared fails the build rather than the page. The URL beside it is a default
 * — what a developer's own machine serves — and a deployment replaces it by registering the same
 * name again at run time with `force`, which is what keeps one artefact promotable from staging to
 * production instead of one build per environment.
 *
 * The federation runtime is injected into the entry rather than the page, so a host with no page of
 * its own still initialises it.
 *
 * The stand-ins are stated here rather than beside the runner's own settings, because forgetting
 * them is not a thing a repository should be able to do. `remote/Thing` is a module the plugin
 * invents while it builds, and the test runner is not a build: a specification reaching any module
 * that imports one fails to load at all, with a resolution error naming a module nobody wrote.
 *
 * @param stated - The name and the remotes. `Hosted` documents every member.
 * @returns The contribution the bundler resolves the remotes through, and what the runner reads in
 *   place of each remote.
 */
export function host(stated: Hosted): readonly Layer[] {
  const held = contribute({
    at: "plugins",
    because: "these modules are fetched from another deployment rather than built into this one",
    item: federation({
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
