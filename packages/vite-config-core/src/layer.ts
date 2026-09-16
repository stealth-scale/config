/**
 * Declares the four kinds of layer and mints one from a plain object.
 *
 * @remarks
 *   A layer carries a brand keyed by a symbol this module never exports, so an
 *   object with the right fields is still rejected where a layer is expected.
 *   The brand lives in the type alone and nothing is written at run time.
 */

import { type ConfigEnv, type UserConfig } from "vite";

import { type Context } from "#context.ts";

/**
 * The key the brand hangs on.
 */
declare const MINTED: unique symbol;

/**
 * The commands a layer takes part in.
 *
 * @remarks
 *   A string is matched against the command. A function is handed the whole
 *   environment and is the only form that can read the mode, so a layer meant
 *   for one mode has to be written as a function.
 */
export type Apply = "build" | "serve" | ((env: ConfigEnv) => boolean);

/**
 * The brand every layer carries.
 */
interface Minted {
  /**
   * Declared and never assigned, so no run-time check can read it.
   */
  readonly [MINTED]: true;
}

/**
 * A layer that sets config keys outright.
 *
 * @remarks
 *   Every preset merges before the first contribution is appended, so an item a
 *   contribution appends always lands on top of a list a preset declared.
 */
export interface Preset extends Minted {
  /**
   * Which commands this runs for. Every command when absent.
   */
  apply?: Apply | undefined;

  /**
   * The config to merge, or a function handed the context that returns one.
   */
  config: ((context: Context) => Promise<UserConfig> | UserConfig) | UserConfig;

  /**
   * Where this sits among the other presets. Ordered with `pre` when absent.
   */
  enforce?: "post" | "pre" | undefined;

  /**
   * Tells this apart from the other three kinds.
   */
  kind: "preset";

  /**
   * The name a removal targets.
   */
  name: string;
}

/**
 * A layer that appends one item to a list inside the config.
 *
 * @remarks
 *   Two contributions naming the same path both land, in the order the
 *   flattened list gave them. Neither is merged into the other, and a path
 *   holding something that is not an array is replaced rather than kept.
 */
export interface Contribution extends Minted {
  /**
   * Which commands this runs for. Every command when absent.
   */
  apply?: Apply | undefined;

  /**
   * The dotted path of the list to append to, such as `test.setupFiles`.
   */
  at: string;

  /**
   * Why the layer is stated. A conformance check rejects an empty reason.
   */
  because: string;

  /**
   * The item to append. Ignored when `itemOf` is present.
   */
  item?: unknown;

  /**
   * Works the item out from the context, and wins over `item`.
   */
  itemOf?: ((context: Context) => unknown) | undefined;

  /**
   * Tells this apart from a preset, a removal and an override.
   */
  kind: "contribution";

  /**
   * The name a removal targets.
   */
  name: string;
}

/**
 * A layer that takes another layer back by name.
 *
 * @remarks
 *   A removal reaches the nearest matching layer above it and the composition
 *   throws when there is none. The environment is filtered first, so a removal
 *   aimed at a layer that only runs on `serve` has to carry the same `apply` or
 *   it throws on a build.
 */
export interface Removal extends Minted {
  /**
   * Which commands this runs for. Every command when absent.
   */
  apply?: Apply | undefined;

  /**
   * Why the layer is taken back. A conformance check rejects an empty reason.
   */
  because: string;

  /**
   * Marks this as the kind that deletes rather than adds.
   */
  kind: "removal";

  /**
   * Identifies this removal, so a later removal can target it.
   */
  name: string;

  /**
   * The name of the layer to take back.
   */
  target: string;
}

/**
 * A layer that rewrites the merged config once every other kind has run.
 *
 * @remarks
 *   An override sees what the layers decided and not what the caller wrote
 *   beside `extends`, because those keys merge afterwards. Two overrides run in
 *   the order they were written, each on what the one before returned.
 */
export interface Override extends Minted {
  /**
   * Which commands this runs for. Every command when absent.
   */
  apply?: Apply | undefined;

  /**
   * Why the config is rewritten. A conformance check rejects an empty reason.
   */
  because: string;

  /**
   * Marks this as the kind that runs last.
   */
  kind: "override";

  /**
   * The name a removal targets.
   */
  name: string;

  /**
   * Takes the config composed so far and returns the one to carry on with.
   */
  refine: (context: Context, config: UserConfig) => UserConfig;
}

/**
 * Any of the four kinds, told apart by `kind`.
 */
export type Layer = Contribution | Override | Preset | Removal;

/**
 * A layer as a caller writes it, before it is branded.
 *
 * @remarks
 *   Each constructor takes this and returns the branded form. A value of this
 *   type is what keeps an object nobody minted out of an `extends` list.
 */
export type Stated<Of extends Layer> = Omit<Of, typeof MINTED>;

/**
 * Brands a stated layer so the composition accepts it.
 *
 * @remarks
 *   This is the one place the brand is invented. The object is handed back
 *   untouched, so a minted layer serialises as exactly what the caller wrote.
 */
function mint<Of extends Layer>(stated: Stated<Of>): Of {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the brand is a phantom, so nothing can produce one by construction
  return stated as Of;
}

/**
 * Mints a preset from the keys a caller states.
 */
export function preset(stated: Omit<Stated<Preset>, "kind">): Preset {
  return mint<Preset>({ ...stated, kind: "preset" });
}

/**
 * Produces a contribution that appends one item at the path it names.
 */
export function contribute(stated: Omit<Stated<Contribution>, "kind">): Contribution {
  return mint<Contribution>({ ...stated, kind: "contribution" });
}

/**
 * Returns a layer that takes back whichever layer its target names.
 */
export function remove(stated: Omit<Stated<Removal>, "kind">): Removal {
  return mint<Removal>({ ...stated, kind: "removal" });
}

/**
 * Wraps a refining function as a layer that runs after every other kind.
 */
export function override(stated: Omit<Stated<Override>, "kind">): Override {
  return mint<Override>({ ...stated, kind: "override" });
}

/**
 * A layer, or an array nesting layers to any depth.
 *
 * @remarks
 *   A builder returning several layers is written into `extends` as it stands.
 *   Flattening is depth first, so the order on the page is the order the layers
 *   take.
 */
export type Extendable = Layer | readonly Extendable[];

/**
 * Reports whether an entry in an extends list is one layer rather than a nest of them.
 */
export function isLayer(held: Extendable): held is Layer {
  return !Array.isArray(held);
}

/**
 * Prefixes every layer in a nest with the name of the package stating it.
 *
 * @remarks
 *   A name becomes `owner/name`, and that full name is what a consumer's
 *   removal has to target. The nesting is flattened on the way through.
 */
export function owned(name: string, layers: readonly Extendable[]): readonly Layer[] {
  return layers.flatMap((held) =>
    isLayer(held) ? [mint<Layer>({ ...held, name: `${name}/${held.name}` })] : owned(name, held),
  );
}

/**
 * Renames a layer and copies every other field across.
 *
 * @remarks
 *   A factory that builds its layer by calling another factory hands back a
 *   layer named for the inner call. A conformance check rejects a name that
 *   does not match the exported function a consumer wrote.
 */
export function named<Of extends Layer>(name: string, layer: Of): Of {
  return mint<Of>({ ...layer, name });
}

/**
 * Reports whether a layer takes part in the environment being configured.
 *
 * @remarks
 *   A layer stating no `apply` takes part in everything. This runs before
 *   removals do, so a layer left out here is invisible to one.
 */
export function applies(layer: Layer, env: ConfigEnv): boolean {
  const { apply } = layer;

  if (apply === undefined) return true;
  if (typeof apply === "function") return apply(env);

  return apply === env.command;
}
