/**
 * Walks the barrel of a config package and sorts its exports into factories, namespaces and
 * constants.
 */

/**
 * A function a consumer calls for a layer, with the path they write to reach it.
 */
export interface Factory {
  /**
   * The function itself.
   */
  readonly call: (...args: readonly unknown[]) => unknown;

  /**
   * The path a consumer writes: `lint.relax`, `layers`, `test.preset.node`.
   */
  readonly path: string;
}

/**
 * The arguments each factory is called with, keyed by the path a consumer writes.
 */
export type Arguments = Readonly<Record<string, readonly unknown[]>>;

/**
 * The result of walking a barrel.
 */
export interface Walked {
  /**
   * Every factory, in the order the barrel exports them.
   */
  readonly factories: readonly Factory[];

  /**
   * The top-level namespaces. A README block table has to name each one.
   */
  readonly namespaces: readonly string[];

  /**
   * Each export that is neither a function, a namespace nor a constant.
   */
  readonly violations: readonly string[];
}

/**
 * The two top-level functions that compose layers for a consumer.
 *
 * Any other top-level function is called only when the specification supplies its arguments. A
 * minting function re-exported from the kernel has no entry and is left alone; a departure such
 * as `css.warn` has one and is checked like a factory in a block.
 */
const COMPOSING: ReadonlySet<string> = new Set(["layers", "workspace"]);

/**
 * Returns true when a value is a function.
 *
 * @param value - The value to test.
 * @returns Whether the value can be called.
 */
export function callable(value: unknown): value is (...args: readonly unknown[]) => unknown {
  return typeof value === "function";
}

/**
 * Returns true when a value is a plain object, as a namespace and a layer both are.
 *
 * @param value - The value to test.
 * @returns Whether the value is an object and not an array.
 */
export function record(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Returns true when an export name is written in capitals, as a constant's is.
 *
 * @param name - The export name.
 * @returns Whether the name is all capitals, digits and underscores.
 */
function constant(name: string): boolean {
  return /^[A-Z][A-Z0-9_]*$/u.test(name);
}

/**
 * Walks one namespace and collects the factories under it.
 *
 * @param path - The path a consumer writes to reach the namespace.
 * @param namespace - The namespace object.
 * @returns The factories under the namespace, and each export the namespace may not hold.
 */
function within(path: string, namespace: Readonly<Record<string, unknown>>): Walked {
  const collected: Factory[] = [];
  const violations: string[] = [];

  for (const [name, value] of Object.entries(namespace)) {
    const at = `${path}.${name}`;

    if (callable(value)) collected.push({ call: value, path: at });
    else if (constant(name)) continue;
    else if (record(value)) {
      const nested = within(at, value);

      collected.push(...nested.factories);
      violations.push(...nested.violations);
    } else violations.push(`${at} is neither a function, a namespace nor a constant`);
  }

  return { factories: collected, namespaces: [], violations };
}

/**
 * Walks a barrel and collects its factories and namespaces.
 *
 * @param module - The barrel, as returned by `await import("#index.ts")`.
 * @param supplied - The arguments the specification supplies, keyed by path. A top-level function
 *   with an entry here is a factory; one without is a helper.
 * @returns The factories, the namespaces, and each export the barrel may not hold.
 */
export function walked(module: Readonly<Record<string, unknown>>, supplied: Arguments): Walked {
  const collected: Factory[] = [];
  const namespaces: string[] = [];
  const violations: string[] = [];

  for (const [name, value] of Object.entries(module)) {
    if (callable(value)) {
      if (COMPOSING.has(name) || supplied[name] !== undefined) {
        collected.push({ call: value, path: name });
      }
    } else if (constant(name)) continue;
    else if (record(value)) {
      const nested = within(name, value);

      namespaces.push(name);
      collected.push(...nested.factories);
      violations.push(...nested.violations);
    } else violations.push(`${name} is neither a function, a namespace nor a constant`);
  }

  return { factories: collected, namespaces, violations };
}

/**
 * Checks that every export is one a config barrel may hold, and that every factory can be called
 * with the arguments the specification supplies.
 *
 * @param barrel - The walked barrel.
 * @param supplied - The arguments the specification supplies, keyed by path.
 * @returns Each violation.
 */
export function factories(barrel: Walked, supplied: Arguments): readonly string[] {
  const uncallable = barrel.factories
    .filter((factory) => factory.call.length > 0 && supplied[factory.path] === undefined)
    .map((factory) => `${factory.path} has required parameters and no entry in arguments`);

  return [...barrel.violations, ...uncallable];
}

/**
 * Derives the prefix of a package's layer names from the package name.
 *
 * `@stealthscale/vite-config-react` names its layers `react.…`, and `@stealthscale/vite-config`
 * names them with no prefix at all. The scope and the `vite-config-` or `vite-plugin-` stem are
 * dropped, and whatever follows the stem is the prefix.
 *
 * @param name - The package name.
 * @returns The prefix, or an empty string for the package that holds the blocks.
 */
export function prefixOf(name: string): string {
  return name.replace(/^@[^/]+\//u, "").replace(/^vite-(?:config|plugin)(?:-|$)/u, "");
}
