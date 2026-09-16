/**
 * What a config is composed of: four kinds of layer, and the only way to make one.
 *
 * A layer carries a brand nothing outside this module can produce, so a bare object literal is not
 * a layer however closely it resembles one. That is not to keep people out — `defineLayer` is here
 * for a repository writing its own — but to leave exactly one door, which can then insist on a name
 * to report the layer by and a reason to justify it.
 */

import { type ConfigEnv, type UserConfig } from "vite";

import { type Context } from "#context.ts";

/**
 * Marks a layer as minted here. Declared but never exported as a value, so only this module can
 * satisfy it.
 */
declare const MINTED: unique symbol;

/**
 * Says when a layer takes part: on a build, on a dev server, or whenever it decides.
 */
export type Apply = "build" | "serve" | ((env: ConfigEnv) => boolean);

/**
 * Holds the brand every layer carries.
 */
interface Minted {
  /**
   * Present on a layer this module made, and on nothing else.
   */
  readonly [MINTED]: true;
}

/**
 * Sets a coherent block of config.
 *
 * Carries no reason: a preset is this design system's decision and its reason belongs in its own
 * documentation, not restated at every call site.
 */
export interface Preset extends Minted {
  /**
   * When it takes part. Always, left out.
   */
  apply?: Apply | undefined;

  /**
   * What it sets, or a function of the environment answering the same.
   */
  config: ((context: Context) => Promise<UserConfig> | UserConfig) | UserConfig;

  /**
   * Where it sits among the other presets. Plugin order is decided here rather than by position in
   * the list, so a caller cannot break a transform by reordering two lines.
   */
  enforce?: "post" | "pre" | undefined;

  /**
   * Names this kind.
   */
  kind: "preset";

  /**
   * What it is called, which is also what a removal names to take it back.
   */
  name: string;
}

/**
 * Appends one item to a list inside the config.
 *
 * Carries a reason, because a contribution is the consuming repository's own decision rather than
 * this design system's.
 */
export interface Contribution extends Minted {
  /**
   * When it takes part.
   */
  apply?: Apply | undefined;

  /**
   * Which list to append to, as a dotted path: `lint.layers`, `test.setupFiles`.
   */
  at: string;

  /**
   * Why this repository needs it.
   */
  because: string;

  /**
   * The item appended, where it does not depend on what is being configured.
   *
   * Stated instead of `itemOf`, never beside it.
   */
  item?: unknown;

  /**
   * Answers the item appended, given what is being configured.
   *
   * Stated where the item depends on the repository, the mode or the environment — a bill of
   * materials carrying a timestamp only for a release, say. Separate from `item` rather than told
   * apart by its type, because an item may legitimately be a function: a hook, a plugin factory, a
   * resolver. Nothing could tell those two apart by looking.
   */
  itemOf?: ((context: Context) => unknown) | undefined;

  /**
   * Names this kind.
   */
  kind: "contribution";

  /**
   * What it is called, which is also what a removal names to take it back.
   */
  name: string;
}

/**
 * Takes back a contribution made earlier in the list.
 *
 * Reaches contributions rather than config, so what it can undo is exactly what something else
 * declared it was adding.
 */
export interface Removal extends Minted {
  /**
   * When it takes part.
   */
  apply?: Apply | undefined;

  /**
   * Why this repository does not want it.
   */
  because: string;

  /**
   * Names this kind.
   */
  kind: "removal";

  /**
   * What it is called.
   */
  name: string;

  /**
   * The name of the layer to take back, of whatever kind. Matching nothing fails the config rather
   * than passing quietly: a layer renamed upstream would otherwise turn a removal into a no-op and
   * put back the thing somebody deliberately took out.
   */
  target: string;
}

/**
 * Rewrites the whole config once everything else has been applied.
 *
 * The escape hatch, for what merging cannot express: removing a plugin, reordering a list, reading
 * one value to decide another. Carries a reason because it is the least legible thing here.
 */
export interface Override extends Minted {
  /**
   * When it takes part.
   */
  apply?: Apply | undefined;

  /**
   * Why this repository needs to reach past the layers.
   */
  because: string;

  /**
   * Names this kind.
   */
  kind: "override";

  /**
   * What it is called.
   */
  name: string;

  /**
   * Takes what is being configured and the merged config, and answers the config to use instead.
   *
   * The context comes first, as it does everywhere a layer is handed one, so its position is never
   * something to remember.
   */
  refine: (context: Context, config: UserConfig) => UserConfig;
}

/**
 * One layer of a config.
 */
export type Layer = Contribution | Override | Preset | Removal;

/**
 * Describes a layer as it is stated, which is everything but the brand.
 *
 * @typeParam Of - The kind of layer being stated.
 */
export type Stated<Of extends Layer> = Omit<Of, typeof MINTED>;

/**
 * Puts the brand on a stated layer.
 *
 * The one assertion in this package, and the reason it is safe is that it is unreachable from
 * outside: the brand is a symbol nothing else can name, so this function is the only thing that can
 * widen a plain object into a layer.
 *
 * @typeParam Of - The kind of layer being minted.
 * @param stated - The layer, without its brand.
 * @returns The same layer, branded.
 */
function mint<Of extends Layer>(stated: Stated<Of>): Of {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the brand is a phantom, so nothing can produce one by construction
  return stated as Of;
}

/**
 * States a preset.
 *
 * @param stated - Everything but the kind and the brand.
 * @returns A preset that sets that config.
 */
export function preset(stated: Omit<Stated<Preset>, "kind">): Preset {
  return mint<Preset>({ ...stated, kind: "preset" });
}

/**
 * States a contribution.
 *
 * @param stated - Everything but the kind and the brand.
 * @returns A contribution appending that item.
 */
export function contribute(stated: Omit<Stated<Contribution>, "kind">): Contribution {
  return mint<Contribution>({ ...stated, kind: "contribution" });
}

/**
 * States a removal.
 *
 * @param stated - Everything but the kind and the brand.
 * @returns A removal taking that target back.
 */
export function remove(stated: Omit<Stated<Removal>, "kind">): Removal {
  return mint<Removal>({ ...stated, kind: "removal" });
}

/**
 * States an override.
 *
 * The one minting function a consuming repository calls directly. The rest are what a config
 * package builds its own entry points out of.
 *
 * @param stated - Everything but the kind and the brand.
 * @returns An override running that refinement last.
 */
export function override(stated: Omit<Stated<Override>, "kind">): Override {
  return mint<Override>({ ...stated, kind: "override" });
}

/**
 * A layer, or any nesting of them. A builder needing several answers a list, and a caller spreads
 * nothing.
 */
export type Extendable = Layer | readonly Extendable[];

/**
 * Answers whether something extended is one layer rather than a nesting of them.
 *
 * @param held - A layer, or a list of them.
 * @returns Whether it is the layer.
 */
export function isLayer(held: Extendable): held is Layer {
  return !Array.isArray(held);
}

/**
 * Puts a package's name on every layer it hands over.
 *
 * A repository composes layers from several packages at once, and two of them relaxing the same
 * paths produce two layers with the same generated name. Both apply, which is right; but a removal
 * naming one then takes back whichever is nearest, and there is no way to say which was meant.
 *
 * Applied where a package hands its layers over rather than at each call, so a package cannot label
 * some of its contributions and forget others, and so a block's builders never learn about
 * ownership — which is what makes this work for blocks that do not exist yet.
 *
 * Answers a flat list whatever nesting it was given, because nothing downstream needs the shape:
 * `extends` flattens what it is handed anyway.
 *
 * @param name - The package's own name: `react`, `paraglide`.
 * @param layers - Everything it contributes, nested to any depth.
 * @returns Every layer, each named under that package.
 */
export function owned(name: string, layers: readonly Extendable[]): readonly Layer[] {
  return layers.flatMap((held) =>
    isLayer(held) ? [mint<Layer>({ ...held, name: `${name}/${held.name}` })] : owned(name, held),
  );
}

/**
 * Gives a layer the name of the factory that returned it, where that factory built it from
 * another.
 *
 * A layer is named by the call a consumer wrote, and a removal targets that name. A factory that
 * delegates to another factory would otherwise hand back a layer named for a call the consumer
 * never wrote.
 *
 * @typeParam Of - The kind of layer being renamed.
 * @param name - The name the consumer wrote.
 * @param layer - The layer another factory returned.
 * @returns The same layer under that name.
 */
export function named<Of extends Layer>(name: string, layer: Of): Of {
  return mint<Of>({ ...layer, name });
}

/**
 * Answers whether a layer takes part in this environment.
 *
 * @param layer - Whichever layer is being considered.
 * @param env - The environment the config is being read for.
 * @returns Whether to apply it.
 */
export function applies(layer: Layer, env: ConfigEnv): boolean {
  const { apply } = layer;

  if (apply === undefined) return true;
  if (typeof apply === "function") return apply(env);

  return apply === env.command;
}
