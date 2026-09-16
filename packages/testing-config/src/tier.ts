/**
 * Checks that every tier a package publishes composes under a build.
 */

import { flattened, isLayer, reason, repeated } from "#layers.ts";
import { type Published } from "#manifest.ts";
import { callable, record } from "#module.ts";

/**
 * The tier modules a specification supplies, keyed by subpath such as `preset/app`.
 */
export type Tiers = Readonly<Record<string, Readonly<Record<string, unknown>>>>;

/**
 * The environment a tier is composed under, which is the one the packer uses.
 */
const BUILDING = { command: "build", mode: "production" } as const;

/**
 * Lists the subpaths a package publishes tiers under.
 *
 * @param published - The manifest to read.
 * @returns Each tier subpath without its leading `./`.
 */
function tiersOf(published: Published): readonly string[] {
  return Object.keys(published.exports ?? {})
    .filter((subpath) => subpath.startsWith("./preset/"))
    .map((subpath) => subpath.slice(2));
}

/**
 * Composes one tier the way the toolchain does.
 *
 * @param subpath - The tier subpath.
 * @param define - The `defineConfig` the tier exports.
 * @param at - The package directory the tier reads its manifest from.
 * @returns Each violation.
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
 * Checks the two exports of one tier module.
 *
 * @param subpath - The tier subpath.
 * @param module - The tier module.
 * @param at - The package directory.
 * @returns Each violation.
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
 * Checks that every tier subpath in the manifest is supplied, exports `layers()` and
 * `defineConfig`, composes to distinct layers, and composes under a build.
 *
 * @param published - The manifest to read the tier subpaths from.
 * @param tiers - The tier modules the specification supplies.
 * @param at - The package directory.
 * @returns Each violation.
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
