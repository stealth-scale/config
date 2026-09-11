/**
 * Turning a list of layers into one config, in the order the list states.
 *
 * Four kinds run in three passes rather than one, because two of them are not order-independent and
 * pretending otherwise would hide it. Presets settle first, so a contribution always appends to a
 * list that already exists. Contributions and removals then run in the order they were written,
 * which is what makes a removal above the contribution it names a mistake rather than a surprise.
 * Overrides run last, on a config nothing else will touch.
 */

import { type UserConfig } from "vite-plus";

import { type Context } from "#context.ts";
import {
  applies,
  type Contribution,
  type Extendable,
  isLayer,
  type Layer,
  type Override,
  type Preset,
} from "#layer.ts";
import { type Composed, merged, NOTHING, replaced } from "#merge.ts";
import { appended } from "#path.ts";

/**
 * Where a preset sits relative to the others.
 */
const ORDER: Record<NonNullable<Preset["enforce"]>, number> = { post: 1, pre: -1 };

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
 * @param context - The command, the mode and the repository around them.
 * @param preset - Whichever preset is being read.
 * @returns The config it sets.
 */
function setBy(context: Context, preset: Preset): Promise<UserConfig> | UserConfig {
  return typeof preset.config === "function" ? preset.config(context) : preset.config;
}

/**
 * Settles every preset, in enforce order.
 *
 * @param context - The command, the mode and the repository around them.
 * @param presets - The presets taking part.
 * @returns The config they agree on, and the record of who set what.
 */
async function settled(context: Context, presets: readonly Preset[]): Promise<Composed> {
  const ordered = presets.toSorted(
    (one, other) => ORDER[one.enforce ?? "pre"] - ORDER[other.enforce ?? "pre"],
  );

  const set = await Promise.all(
    ordered.map(async (preset) => [preset, await setBy(context, preset)] as const),
  );

  return set.reduce((composed, [preset, config]) => merged(composed, config, preset), NOTHING);
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
 * @param context - The command, the mode and the repository around them.
 * @param extended - The layers, nested to any depth.
 * @returns The config, and the record of which layer decided each value.
 * @throws Error When a removal names nothing stated above it.
 */
export async function resolved(
  context: Context,
  extended: readonly Extendable[],
): Promise<Composed> {
  const taking = surviving(flattened(extended).filter((layer) => applies(layer, context)));

  let composed = await settled(
    context,
    taking.filter((layer): layer is Preset => layer.kind === "preset"),
  );

  for (const contribution of taking.filter(
    (one): one is Contribution => one.kind === "contribution",
  )) {
    const item = contribution.itemOf ? contribution.itemOf(context) : contribution.item;

    composed = replaced(composed, appended(composed.config, contribution.at, item), contribution);
  }

  for (const layer of taking.filter((one): one is Override => one.kind === "override")) {
    composed = replaced(composed, layer.refine(context, composed.config), layer);
  }

  return composed;
}
