/**
 * Calls the factories a config barrel exports and judges the layers they hand back.
 *
 * @remarks
 *   Each factory is called once and every check after that reads the recording, so four checks
 *   agree on what a factory returned and a factory with a side effect performs it once. A factory
 *   that throws is recorded as such rather than ending the run.
 */

import { type Arguments, type Factory, record } from "#module.ts";

/**
 * Distinguishes the four kinds a layer can declare itself as.
 *
 * @remarks
 *   The kind decides which rules a layer is held to. A preset is the one kind that states no
 *   reason, and the other three state one.
 */
export type LayerKind = "contribution" | "override" | "preset" | "removal";

/**
 * Describes the part of a layer these checks read.
 *
 * @remarks
 *   Nothing here comes from the kernel's own types, so a package built against a different
 *   version of the kernel is checked on the shape of what it returns.
 */
export interface Layer {
  /**
   * Why the layer exists. It is typed loosely because a layer that omits it is what the check
   * reports.
   */
  readonly because?: unknown;

  /**
   * Which of the four kinds the layer declares.
   */
  readonly kind: LayerKind;

  /**
   * The name a consumer reads back out of a merged configuration.
   */
  readonly name: string;
}

/**
 * Records what one factory produced, or why nothing came back.
 *
 * @remarks
 *   A factory that threw yields empty arrays alongside the message, so a caller reading `layers`
 *   sees no layers rather than an exception.
 */
export interface Found {
  /**
   * The message from a factory that threw, undefined where the call returned.
   */
  readonly error: string | undefined;

  /**
   * Every layer in what came back, at whatever depth it was nested.
   */
  readonly layers: readonly Layer[];

  /**
   * Whether the factory returned an array. One that returns a single layer names it for the call,
   * and one that returns an array composes layers other factories made.
   */
  readonly listed: boolean;

  /**
   * Everything that came back and is not a layer.
   */
  readonly others: readonly unknown[];

  /**
   * The dotted path the factory sits at in the barrel.
   */
  readonly path: string;
}

/**
 * Sets the name a layer has to answer to, and how strictly it is matched.
 */
interface Expected {
  /**
   * Whether the name has to equal `start` rather than begin with it.
   */
  readonly exact: boolean;

  /**
   * The name, or the prefix, the layer's own name is measured against.
   */
  readonly start: string;
}

/**
 * The four kind strings a value has to declare before it passes as a layer.
 */
const KINDS: ReadonlySet<string> = new Set(["contribution", "override", "preset", "removal"]);

/**
 * Reports whether a value carries the name and kind that make it a layer.
 *
 * @remarks
 *   The test is structural. A layer minted by a second copy of the kernel passes it, and so does
 *   an object a specification wrote by hand.
 */
export function isLayer(value: unknown): value is Layer {
  return record(value) && typeof value["name"] === "string" && KINDS.has(String(value["kind"]));
}

/**
 * Unwraps nested arrays down to the values they hold.
 *
 * @remarks
 *   A value that is not an array comes back as a single-item array, so one caller treats a
 *   factory returning one layer and a factory returning a tree of them the same way.
 */
export function flattened(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value.flatMap((item) => flattened(item)) : [value];
}

/**
 * Turns a caught value into the message a violation quotes.
 *
 * @remarks
 *   A factory can throw anything at all. Whatever is not an Error is stringified, so a thrown
 *   string arrives intact and a thrown object reads as `[object Object]`.
 */
export function reason(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Calls one factory and records its layers, its leftovers and any failure.
 *
 * @remarks
 *   The supplied arguments are spread in the order the specification wrote them. A factory that
 *   throws ends the recording there, and `listed` stays false even where it would have returned
 *   an array.
 */
function calling(factory: Factory, args: readonly unknown[]): Found {
  try {
    const returned = factory.call(...args);
    const items = flattened(returned);

    return {
      error: undefined,
      layers: items.filter((item) => isLayer(item)),
      listed: Array.isArray(returned),
      others: items.filter((item) => !isLayer(item)),
      path: factory.path,
    };
  } catch (error) {
    return { error: reason(error), layers: [], listed: false, others: [], path: factory.path };
  }
}

/**
 * Calls every factory there are arguments for and collects what each one produced.
 *
 * @remarks
 *   A factory with required parameters and no supplied entry is skipped here and reported by the
 *   barrel check, so a missing entry never reaches a layer check as a naming failure.
 * @returns One record per factory called, in the order the walk found them.
 */
export function layersOf(factories: readonly Factory[], supplied: Arguments): readonly Found[] {
  return factories
    .filter((factory) => factory.call.length === 0 || supplied[factory.path] !== undefined)
    .map((factory) => calling(factory, supplied[factory.path] ?? []));
}

/**
 * Reports a factory that throws, and a return value shaped like a layer without being one.
 *
 * @remarks
 *   A value carrying `name` or `kind` and failing the guard is a layer someone assembled by hand
 *   and got wrong. A value carrying neither is a plugin, a config or anything else a factory may
 *   legitimately return, and only an array mixing those with layers is reported.
 */
export function kind(found: readonly Found[]): readonly string[] {
  return found.flatMap((result) => {
    if (result.error !== undefined) {
      return [`${result.path} throws when called: ${result.error}`];
    }

    const shaped = result.others.filter(
      (value) => record(value) && ("name" in value || "kind" in value),
    );

    if (shaped.length > 0) {
      return [`${result.path} returns something shaped like a layer that is not one`];
    }

    return result.listed && result.layers.length > 0 && result.others.length > 0
      ? [`${result.path} returns an array holding something that is not a layer`]
      : [];
  });
}

/**
 * Strips the arguments off a layer name, leaving the call that made it.
 *
 * @remarks
 *   A layer records the arguments that tell two calls of one factory apart in parentheses, and
 *   only the part in front of the opening parenthesis is measured against the factory's path.
 */
function head(name: string): string {
  return name.replace(/\(.*$/su, "");
}

/**
 * Works out the name, or the prefix, a factory's layers have to carry.
 *
 * @remarks
 *   A factory returning one layer names it for the call exactly. A factory returning an array
 *   composes layers other factories made, and each of those only has to sit under the block the
 *   factory belongs to.
 */
function expected(result: Found, prefix: string): Expected {
  const block = result.path.replace(/\..*$/su, "");
  const own = prefix === "" ? "" : `${prefix}.`;

  if (!result.listed) return { exact: true, start: `${own}${result.path}` };

  return block === result.path
    ? { exact: false, start: own }
    : { exact: false, start: `${own}${block}.` };
}

/**
 * Reports a layer named for something other than the call that made it, or named for its owner.
 *
 * @remarks
 *   A name holding a slash came from a package name, which a merged configuration should never
 *   show. Every other name is measured against the prefix the package name yields, and the base
 *   config passes an empty prefix that adds nothing.
 */
export function named(found: readonly Found[], prefix: string): readonly string[] {
  return found.flatMap((result) => {
    const { exact, start } = expected(result, prefix);

    return result.layers.flatMap((layer) => {
      const called = head(layer.name);

      if (called.includes("/")) {
        return [`${result.path} returns ${layer.name}, whose name carries an owner`];
      }

      if (exact ? called !== start : !called.startsWith(start)) {
        return [`${result.path} returns ${layer.name}, which is not named for the call`];
      }

      return [];
    });
  });
}

/**
 * Reports a contribution, override or removal without a reason, and a preset carrying one.
 *
 * @remarks
 *   A preset is the one kind whose existence explains itself, so stating a reason on one is as
 *   much a breach as omitting it from the rest. Whitespace does not pass as a reason.
 */
export function reasoned(found: readonly Found[]): readonly string[] {
  return found.flatMap((result) =>
    result.layers.flatMap((layer) => {
      if (layer.kind === "preset") {
        return "because" in layer ? [`${layer.name} is a preset carrying a because`] : [];
      }

      return typeof layer.because === "string" && layer.because.trim() !== ""
        ? []
        : [`${layer.name} is a ${layer.kind} with an empty because`];
    }),
  );
}

/**
 * Lists the names that occur more than once under the same kind.
 *
 * @remarks
 *   A name is unique per kind, so one block may contribute and override under a single name. A
 *   name occurring three times is listed once.
 */
export function repeated(layers: readonly Layer[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const layer of layers) {
    const key = `${layer.kind}:${layer.name}`;

    if (seen.has(key)) duplicates.add(layer.name);
    seen.add(key);
  }

  return [...duplicates];
}

/**
 * Reports a factory that returns two layers under one name and kind.
 *
 * @remarks
 *   The pair of name and kind identifies a layer, so a factory handing back two of them leaves a
 *   consumer unable to say which one a configuration took.
 */
export function unique(found: readonly Found[]): readonly string[] {
  return found.flatMap((result) =>
    repeated(result.layers).map((name) => `${result.path} returns two layers named ${name}`),
  );
}
