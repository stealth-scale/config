/**
 * Turning a list of layers into one config, in the order the list states.
 *
 * Four kinds run in three passes rather than one, because two of them are not order-independent and
 * pretending otherwise would hide it. Presets settle first, so a contribution always appends to a
 * list that already exists. Contributions and removals then run in the order they were written,
 * which is what makes a removal above the contribution it names a mistake rather than a surprise.
 * Overrides run last, on a config nothing else will touch.
 */

import { type ConfigEnv, type UserConfig } from "vite-plus";

import {
  applies,
  type Contribution,
  type Extendable,
  isLayer,
  type Layer,
  type Override,
  type Preset,
} from "#core/layer.ts";
import { type Composed, merged, NOTHING, replaced } from "#core/merge.ts";
import { appended } from "#core/path.ts";

/**
 * Where a preset sits relative to the others.
 */
const ORDER = { post: 1, pre: -1 } as const;

/**
 * Flattens whatever nesting a caller wrote into one list of layers.
 *
 * @param extended - The layers, nested to any depth.
 * @returns Every layer, in the order written.
 */
export function flattened(extended: readonly Extendable[]): readonly Layer[] {
  return extended.flatMap((held) => (isLayer(held) ? [held] : flattened(held)));
}

/**
 * Reads what a preset sets, which may be stated or computed.
 *
 * @param preset - Whichever preset is being read.
 * @param env - The environment the config is being read for.
 * @returns The config it sets.
 */
function setBy(preset: Preset, env: ConfigEnv): Promise<UserConfig> | UserConfig {
  return typeof preset.config === "function" ? preset.config(env) : preset.config;
}

/**
 * Settles every preset, in enforce order.
 *
 * @param presets - The presets taking part.
 * @param env - The environment.
 * @returns The config they agree on, and the record of who set what.
 */
async function settled(presets: readonly Preset[], env: ConfigEnv): Promise<Composed> {
  const ordered = presets.toSorted(
    (one, other) => (ORDER[one.enforce ?? "pre"] ?? 0) - (ORDER[other.enforce ?? "pre"] ?? 0),
  );

  const set = await Promise.all(ordered.map((preset) => Promise.resolve(setBy(preset, env))));

  return ordered.reduce(
    (composed, preset, index) => merged(composed, set[index] ?? {}, preset),
    NOTHING,
  );
}

/**
 * Walks the layers in the order they were written, applying each removal to what came before it.
 *
 * Every kind can be taken back, not only a contribution. A preset a framework package states and an
 * override it adds are as much its decisions as the item it appends, and a repository disagreeing
 * with one of them has the same thing to say about it. Taking a preset back by name is also the
 * only alternative to restating the keys it set, which is the work the preset existed to do.
 *
 * Order still decides: a removal reaches what is written above it and nothing below. That is what
 * keeps a config readable from the top, and what makes a removal in the wrong place an error rather
 * than a silence.
 *
 * @param layers - Every layer taking part, in order.
 * @returns The layers that survived, in the order they were written.
 * @throws Error When a removal names nothing stated above it.
 */
export function surviving(layers: readonly Layer[]): readonly Layer[] {
  const held: Layer[] = [];

  for (const layer of layers) {
    if (layer.kind !== "removal") {
      held.push(layer);
      continue;
    }

    const found = held.findLastIndex((one) => one.name === layer.target);
    if (found === -1) {
      throw new Error(
        `${layer.name} takes back ${layer.target}, which nothing above it stated. ` +
          "A removal below what it names is a no-op; one above it is written too early.",
      );
    }

    held.splice(found, 1);
  }

  return held;
}

/**
 * Composes every layer into one config.
 *
 * @param extended - The layers, nested to any depth.
 * @param env - The environment the config is being read for.
 * @returns The config, and the record of which layer decided each value.
 * @throws Error When a removal names nothing stated above it.
 */
export async function resolved(extended: readonly Extendable[], env: ConfigEnv): Promise<Composed> {
  const taking = surviving(flattened(extended).filter((layer) => applies(layer, env)));

  let composed = await settled(
    taking.filter((layer): layer is Preset => layer.kind === "preset"),
    env,
  );

  for (const contribution of taking.filter(
    (one): one is Contribution => one.kind === "contribution",
  )) {
    composed = replaced(
      composed,
      appended(composed.config, contribution.at, contribution.item),
      contribution,
    );
  }

  for (const layer of taking.filter((one): one is Override => one.kind === "override")) {
    composed = replaced(composed, layer.refine(composed.config, env), layer);
  }

  return composed;
}
