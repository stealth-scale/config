/**
 * Calls each factory, reads the layers it returns, and checks each layer against the contract.
 */

import { type Arguments, type Factory, record } from "#module.ts";

/**
 * Names the four kinds the kernel mints.
 */
export type LayerKind = "contribution" | "override" | "preset" | "removal";

/**
 * Describes a layer as far as a check reads it.
 */
export interface Layer {
  /**
   * States the reason. Every kind but a preset carries one.
   */
  readonly because?: unknown;

  /**
   * States the kind.
   */
  readonly kind: LayerKind;

  /**
   * States the name a removal targets.
   */
  readonly name: string;
}

/**
 * Describes the return value of one factory.
 */
export interface Found {
  /**
   * Holds the error message when the call threw.
   */
  readonly error: string | undefined;

  /**
   * Lists each layer the call returned, flattened.
   */
  readonly layers: readonly Layer[];

  /**
   * States whether the call returned an array. An array is named differently from one layer.
   */
  readonly listed: boolean;

  /**
   * Lists each returned value that is not a layer.
   */
  readonly others: readonly unknown[];

  /**
   * States the path a consumer writes to call the factory.
   */
  readonly path: string;
}

/**
 * Describes the name a layer has to carry.
 */
interface Expected {
  /**
   * States whether the whole name before the arguments has to match `start`.
   */
  readonly exact: boolean;

  /**
   * States the text the name has to start with.
   */
  readonly start: string;
}

/**
 * Lists the four kinds. A record with a name and one of these kinds is a layer.
 */
const KINDS: ReadonlySet<string> = new Set(["contribution", "override", "preset", "removal"]);

/**
 * Returns true when a value is a layer.
 *
 * @param value - The value under test.
 * @returns Whether the value has a string name and one of the four kinds.
 */
export function isLayer(value: unknown): value is Layer {
  return record(value) && typeof value["name"] === "string" && KINDS.has(String(value["kind"]));
}

/**
 * Flattens a return value to any depth.
 *
 * @param value - The return value.
 * @returns Each item in order.
 */
export function flattened(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value.flatMap((item) => flattened(item)) : [value];
}

/**
 * Returns the message of a thrown value.
 *
 * @param error - The thrown value.
 * @returns The message of an error, or the string form of anything else.
 */
export function reason(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Calls one factory and sorts its return value into layers and other values.
 *
 * @param factory - The factory to call.
 * @param args - The arguments to call it with.
 * @returns The sorted return value, or the error message when the call threw.
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
 * Calls every factory and reads each return value.
 *
 * A factory with required parameters and no entry in `arguments` is not called. The factories
 * check reports it.
 *
 * @param factories - The factories the barrel exports.
 * @param supplied - The arguments the specification supplies, by path.
 * @returns Each return value, sorted into layers and other values.
 */
export function layersOf(factories: readonly Factory[], supplied: Arguments): readonly Found[] {
  return factories
    .filter((factory) => factory.call.length === 0 || supplied[factory.path] !== undefined)
    .map((factory) => calling(factory, supplied[factory.path] ?? []));
}

/**
 * Checks that every value shaped like a layer is one.
 *
 * A helper may return a string, a version or a record of settings. None of those is checked. A
 * record with a name or a kind but not both is a layer built by hand. An array that mixes layers
 * with other values cannot be composed.
 *
 * @param found - The return value of each factory.
 * @returns Each violation.
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
 * Returns the part of a layer name before its arguments.
 *
 * @param name - The layer name.
 * @returns The name without its parenthesised arguments.
 */
function head(name: string): string {
  return name.replace(/\(.*$/su, "");
}

/**
 * Derives the name a factory's layers have to carry.
 *
 * A factory that returns one layer names it for the call. The arguments that distinguish two calls
 * follow in parentheses. A factory that returns an array composes layers other factories made.
 * Each of those keeps its own name inside the same block. `react.layers()` returns
 * `react.plugin.refresh`. `lint.preset.node()` returns `lint.node`.
 *
 * @param result - The return value of the factory.
 * @param prefix - The package prefix.
 * @returns The expected start of the name, and whether the whole head has to match it.
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
 * Checks that each layer is named for the call a consumer wrote.
 *
 * @param found - The return value of each factory.
 * @param prefix - The package prefix.
 * @returns Each violation.
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
 * Checks that every departure carries a reason and no preset does.
 *
 * @param found - The return value of each factory.
 * @returns Each violation.
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
 * Lists each name that appears twice in an array of layers with the same kind.
 *
 * A removal and the contribution that replaces it share a name on purpose. Two kinds under one
 * name are not a repeat.
 *
 * @param layers - The array of layers.
 * @returns Each repeated name, once.
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
 * Checks that no factory returns two layers under one name.
 *
 * @param found - The return value of each factory.
 * @returns Each violation.
 */
export function unique(found: readonly Found[]): readonly string[] {
  return found.flatMap((result) =>
    repeated(result.layers).map((name) => `${result.path} returns two layers named ${name}`),
  );
}
