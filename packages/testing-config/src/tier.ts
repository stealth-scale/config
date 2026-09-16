/**
 * Composes every preset a config package publishes and reports what refuses to compose.
 *
 * @remarks
 *   A tier is checked by running it. Its layers are collected and its `defineConfig` is driven
 *   through a build, so a tier that type-checks and then fails on the first import still fails
 *   here.
 */

import { flattened, isLayer, reason, repeated } from "#layers.ts";
import { type Published } from "#manifest.ts";
import { callable, record } from "#module.ts";

/**
 * Keys the tier modules a specification supplies by the subpath that publishes each one.
 *
 * @remarks
 *   A key is written as the manifest exports it with the leading dot removed, such as
 *   `preset/app`. A published subpath with no entry here is a violation rather than a tier that
 *   goes unchecked.
 */
export type Tiers = Readonly<Record<string, Readonly<Record<string, unknown>>>>;

/**
 * The environment every tier is composed under.
 */
const BUILDING = { command: "build", mode: "production" } as const;

/**
 * Lists the preset subpaths a manifest exports, each without its leading dot.
 *
 * @remarks
 *   Only `./preset/` counts as a tier. The barrel and any other subpath belong to the manifest
 *   checks and are not composed.
 */
function tiersOf(published: Published): readonly string[] {
  return Object.keys(published.exports ?? {})
    .filter((subpath) => subpath.startsWith("./preset/"))
    .map((subpath) => subpath.slice(2));
}

/**
 * Drives a tier's `defineConfig` through a build and reports what it refuses.
 *
 * @remarks
 *   The export is called with the package directory and has to hand back a function of the
 *   environment, which is awaited in turn. A throw at either step is reported as the tier failing
 *   to compose, carrying the message with it.
 */
async function defined(
  subpath: string,
  define: (...args: readonly unknown[]) => unknown,
  at: string,
): Promise<readonly string[]> {
  try {
    const exported = define(at);

    if (!callable(exported)) {
      return [`${subpath} defineConfig returns something other than a function of the environment`];
    }

    const composed: unknown = await exported(BUILDING);

    return record(composed) ? [] : [`${subpath} composes to something other than a config`];
  } catch (error) {
    return [`${subpath} fails to compose under a build: ${reason(error)}`];
  }
}

/**
 * Checks one tier for both entry points, for layers only, and for no layer twice.
 *
 * @remarks
 *   A missing entry point ends the check there, because neither question below it can be answered
 *   without one. A tier that repeats a layer is reported once per name.
 */
async function composing(
  subpath: string,
  module: Readonly<Record<string, unknown>>,
  at: string,
): Promise<readonly string[]> {
  const { defineConfig, layers } = module;

  if (!callable(layers)) return [`${subpath} exports no layers()`];
  if (!callable(defineConfig)) return [`${subpath} exports no defineConfig`];

  const items = flattened(layers());
  const composed = items.filter((item) => isLayer(item));
  const foreign =
    composed.length === items.length ? [] : [`${subpath} composes something that is not a layer`];
  const twice = repeated(composed).map((name) => `${subpath} composes twice a layer named ${name}`);

  return [...foreign, ...twice, ...(await defined(subpath, defineConfig, at))];
}

/**
 * Checks that every published tier was supplied and that each one composes.
 *
 * @remarks
 *   Tiers are composed at the same time, so one that fails hides nothing about the others. A
 *   subpath the manifest exports and the caller left out is reported without anything being
 *   loaded on its behalf.
 */
export async function composes(
  published: Published,
  tiers: Tiers,
  at: string,
): Promise<readonly string[]> {
  const violations = await Promise.all(
    tiersOf(published).map((subpath) => {
      const module = tiers[subpath];

      return module === undefined
        ? Promise.resolve([`${subpath} is exported and not given to tiers`])
        : composing(subpath, module, at);
    }),
  );

  return violations.flat();
}
