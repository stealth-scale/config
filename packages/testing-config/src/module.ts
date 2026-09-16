/**
 * Walks an imported barrel into the factories and namespaces the later checks work from.
 *
 * @remarks
 *   The barrel is walked as a value and not read as source, so a namespace is whatever the module
 *   exports as an object and a factory is whatever it exports as a function. A constant is
 *   recognised by its name alone and never opened.
 */

/**
 * Pairs a callable export with the path it sits at in the barrel.
 *
 * @remarks
 *   The path is what a consumer writes at a call site, such as `lint.relax`, and it is the key
 *   arguments and layer names are matched under.
 */
export interface Factory {
  /**
   * The exported function, called with whatever the specification supplies.
   */
  readonly call: (...args: readonly unknown[]) => unknown;

  /**
   * Where the function sits in the barrel, dotted from the top level down.
   */
  readonly path: string;
}

/**
 * Maps each factory's path to the arguments it is called with.
 *
 * @remarks
 *   A factory with required parameters and no entry here goes uncalled and is reported. Supplying
 *   an empty array for one is the way to call it with nothing on purpose.
 */
export type Arguments = Readonly<Record<string, readonly unknown[]>>;

/**
 * Groups what the walk made of a barrel into factories, namespaces, and what fits neither.
 *
 * @remarks
 *   Namespaces are collected at the top level only, because the README's block table names those
 *   and not the exports nested inside them.
 */
export interface Walked {
  /**
   * Every callable export worth calling, at whatever depth it was found.
   */
  readonly factories: readonly Factory[];

  /**
   * The top-level namespaces, under the names the README's block table uses.
   */
  readonly namespaces: readonly string[];

  /**
   * Every export that is neither a function, a namespace nor a constant.
   */
  readonly violations: readonly string[];
}

/**
 * The top-level factories called whether or not a specification supplies arguments.
 *
 * @remarks
 *   Both compose the layers a consumer gets by extending a package, so their output is checked in
 *   every specification. Any other top-level function is called only against a supplied entry,
 *   which leaves a minting function re-exported from the kernel alone.
 */
const COMPOSING: ReadonlySet<string> = new Set(["layers", "workspace"]);

/**
 * Reports whether a value can be called at all.
 *
 * @remarks
 *   A class passes this and is then called without `new`, which throws and surfaces as a factory
 *   that throws rather than as an export of the wrong kind.
 */
export function callable(value: unknown): value is (...args: readonly unknown[]) => unknown {
  return typeof value === "function";
}

/**
 * Reports whether a value is a plain object rather than an array or null.
 *
 * @remarks
 *   An array is excluded because a barrel exporting one is neither a namespace nor a factory, and
 *   null is excluded because `typeof` alone calls it an object.
 */
export function record(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Reports whether an export name is written the way the house writes a constant.
 *
 * @remarks
 *   The name decides this and the value is never consulted, so a constant holding an object is
 *   left where it is rather than walked as a namespace.
 */
export function constant(name: string): boolean {
  return /^[A-Z][A-Z0-9_]*$/u.test(name);
}

/**
 * Gathers the factories inside one namespace, and the exports that belong on neither list.
 *
 * @remarks
 *   The descent goes as deep as the namespaces nest and the path gains a segment at each level.
 *   A namespace found here is not listed as one, because only a top-level namespace is a block.
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
 * Splits a barrel into the factories to call, the blocks to match against the README, and the
 * exports that are neither.
 *
 * @remarks
 *   A top-level function is picked up only where it composes layers or the caller supplied
 *   arguments for it. Everything inside a namespace is picked up whether or not it can be called
 *   yet, so an uncallable one is reported instead of being passed over.
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
 * Reports an export the walk could not place, and a factory nothing in the specification can call.
 *
 * @remarks
 *   A factory is only as checked as its arguments allow, so omitting one from `arguments` is
 *   itself the breach. Adding a required parameter to a factory breaks every specification that
 *   had been calling it with nothing.
 */
export function factories(barrel: Walked, supplied: Arguments): readonly string[] {
  const uncallable = barrel.factories
    .filter((factory) => factory.call.length > 0 && supplied[factory.path] === undefined)
    .map((factory) => `${factory.path} has required parameters and no entry in arguments`);

  return [...barrel.violations, ...uncallable];
}

/**
 * Derives the prefix a package's layer names carry from the package's published name.
 *
 * @remarks
 *   The scope goes, and so does a leading `vite-config` or `vite-plugin`. The name
 *   `@stealthscale/vite-config-react` yields `react`, and `@stealthscale/vite-config` yields an
 *   empty string, which asks for layer names with no prefix at all.
 */
export function prefixOf(name: string): string {
  return name.replace(/^@[^/]+\//u, "").replace(/^vite-(?:config|plugin)(?:-|$)/u, "");
}
