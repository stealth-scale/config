/**
 * Running a repository's own code around a pack.
 */

import { type Override, override } from "@stealthscale/config-core";

import { type Moments } from "#pack/settings.ts";

/**
 * Describes code a repository runs around its own pack.
 */
export interface Hooked {
  /**
   * Why this repository needs it, kept with the layer so a later reader can weigh it.
   */
  because: string;

  /**
   * The code, against the moment each piece runs. `build:prepare` before the packer starts,
   * `build:before` before each bundle, `build:done` once the chunks exist.
   */
  hooks: Moments;
}

/**
 * Runs a repository's own code at a point in the pack.
 *
 * For an artefact no bundler produces and the package still ships: a stylesheet solved from a
 * recipe, a manifest of what was generated, a file written from a schema. Writing it in
 * `build:before` is what puts it on disk in time for the packer to find it, and keeps the thing
 * that writes it beside the package that ships it rather than in a script somebody has to remember
 * to run.
 *
 * Stated as an override because it is the least legible layer a config can carry: arbitrary code,
 * at a moment nothing else in the config names, doing something the config cannot describe. The
 * reason travels with it for that.
 *
 * Composes with whatever a tier already asked for rather than replacing it, so a repository adding
 * `build:done` keeps the `build:before` something else stated. Two layers naming the same moment
 * are the one case that does not compose, and the nearer one wins.
 *
 * @param stated - The hooks, and why.
 * @returns The override.
 */
export function hook(stated: Hooked): Override {
  return override({
    because: stated.because,
    name: `pack.hook(${Object.keys(stated.hooks).join(", ")})`,
    refine: (_context, config) => {
      const held = Array.isArray(config.pack) ? undefined : config.pack;
      const already: Moments = typeof held?.hooks === "object" ? held.hooks : {};

      return { ...config, pack: { ...held, hooks: { ...already, ...stated.hooks } } };
    },
  });
}
