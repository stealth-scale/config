/**
 * Which layer decided each value, kept while the config is being composed.
 *
 * The reason layering is worth more than a deep merge: a merged config is a flat object with no
 * memory of where anything came from, so a wrong value has no address and the only way to find it
 * is to read every layer. Recording who wrote what as it is written costs one walk per layer and
 * turns that into a question with an answer.
 */

import { type Layer } from "#core/layer.ts";
import { leaves, at as read } from "#core/path.ts";

/**
 * Says that one layer decided one value.
 */
export interface Source {
  /**
   * The dotted path it decided.
   */
  at: string;

  /**
   * Why, where the layer stated a reason. A preset states none.
   */
  because?: string | undefined;

  /**
   * Which kind of layer it was, which is how it decided rather than merely that it did.
   */
  kind: Layer["kind"];

  /**
   * What the layer is called.
   */
  name: string;
}

/**
 * Records what one layer changed, by comparing the config either side of it.
 *
 * Compared by identity rather than by value. Every step here rebuilds the objects it touches and
 * leaves the rest alone, so a path whose value is the same object is a path nothing wrote.
 *
 * @param before - The config as the layer found it.
 * @param after - The config the layer left.
 * @param layer - Which layer to record the change against.
 * @returns One source per path it decided.
 */
export function wrote(before: object, after: object, layer: Layer): readonly Source[] {
  const held = at(before);

  return leaves(after)
    .filter((path) => held.get(path) !== at(after).get(path))
    .map((path) => ({ at: path, because: reasonOf(layer), kind: layer.kind, name: layer.name }));
}

/**
 * Reads the reason a layer stated, where its kind states one.
 *
 * @param layer - Whichever layer stated it.
 * @returns Its reason, or nothing for a preset.
 */
function reasonOf(layer: Layer): string | undefined {
  return layer.kind === "preset" ? undefined : layer.because;
}

/**
 * Reads every leaf of a config into a map, for comparing one against another.
 *
 * @param held - The config.
 * @returns Each leaf path against what sits there.
 */
function at(held: object): ReadonlyMap<string, unknown> {
  return new Map(
    leaves(held).map((path) => {
      return [path, read(held, path)];
    }),
  );
}

/**
 * Answers what decided one path, latest first.
 *
 * @param sources - Everything recorded while composing.
 * @param path - The dotted path asked about.
 * @returns The layers that wrote it, in the order they did.
 */
export function why(sources: readonly Source[], path: string): readonly Source[] {
  return sources.filter((source) => source.at === path || source.at.startsWith(`${path}.`));
}
