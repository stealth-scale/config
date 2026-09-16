/**
 * Checks that a plugin package exports a factory returning a house-named Vite plugin.
 *
 * @remarks
 *   A plugin is called rather than read, because its name and its hooks are decided when the
 *   factory runs. A package exporting several factories, at the top level or inside a namespace,
 *   is asked only that one of them produces a plugin, and every plugin it does produce is held to
 *   the naming rule.
 */

import { reason } from "#layers.ts";
import { type Published } from "#manifest.ts";
import { type Arguments, callable, constant, record } from "#module.ts";

/**
 * Prefixes the name every plugin in this repository answers to.
 */
const HOUSE = "stealth:";

/**
 * Lists the hook a value carries before it passes as a house plugin.
 *
 * @remarks
 *   A plugin reads its root from the resolved configuration, because under a task runner the
 *   working directory is the workspace root. Nothing else is asked of the hook set: a plugin that
 *   writes at `generateBundle` and one that serves at `load` are both house plugins.
 */
const HOOKS = ["configResolved"];

/**
 * Reports a plugin named for something other than its factory, or missing one of the base hooks.
 *
 * @remarks
 *   The expected name is built from the export path, so someone reading a resolved config can
 *   point at the factory that put the plugin there. Each missing hook is reported on its own.
 */
function shaped(path: string, plugin: Readonly<Record<string, unknown>>): readonly string[] {
  const name = String(plugin["name"]);
  const missing = HOOKS.filter((hook) => !callable(plugin[hook]));

  return [
    ...(name === `${HOUSE}${path}`
      ? []
      : [`${path} returns a plugin named ${name}, not ${HOUSE}${path}`]),
    ...missing.map((hook) => `${path} returns a plugin without ${hook}`),
  ];
}

/**
 * Calls one export and hands back what it produced, or the failure wrapped in an Error.
 *
 * @remarks
 *   A factory with required parameters and no supplied arguments yields undefined and is passed
 *   over, because calling it with nothing would report a failure the package did not cause.
 */
function returned(
  path: string,
  call: (...args: readonly unknown[]) => unknown,
  supplied: Arguments,
): unknown {
  const args = supplied[path];

  if (args === undefined && call.length > 0) return undefined;

  try {
    return call(...(args ?? []));
  } catch (error) {
    return new Error(reason(error));
  }
}

/**
 * Calls every factory in a namespace and in the namespaces it holds, and records each plugin that
 * is misnamed or missing a hook.
 *
 * @remarks
 *   The path gains a segment at each level, so a plugin exported as `theme.runtime` is asked to be
 *   named `stealth:theme.runtime`. A constant holding an object is passed over rather than walked.
 * @returns How many plugins the walk found.
 */
function visited(
  prefix: string,
  namespace: Readonly<Record<string, unknown>>,
  supplied: Arguments,
  violations: string[],
): number {
  let plugins = 0;

  for (const [name, value] of Object.entries(namespace)) {
    const path = prefix === "" ? name : `${prefix}.${name}`;

    if (callable(value)) {
      const result = returned(path, value, supplied);

      if (result instanceof Error) violations.push(`${path} throws when called: ${result.message}`);
      else if (record(result) && typeof result["name"] === "string") {
        plugins += 1;
        violations.push(...shaped(path, result));
      }
    } else if (record(value) && !constant(name)) {
      plugins += visited(path, value, supplied, violations);
    }
  }

  return plugins;
}

/**
 * Reports a barrel holding no plugin at all, and every plugin whose name or hooks are wrong.
 *
 * @remarks
 *   Each callable export is called, at the top level and inside every namespace, so an export with
 *   a side effect performs it during the check. Anything coming back as an object with a string
 *   `name` is taken for a plugin.
 */
export function named(
  module: Readonly<Record<string, unknown>>,
  supplied: Arguments,
): readonly string[] {
  const violations: string[] = [];
  const plugins = visited("", module, supplied, violations);

  return plugins === 0 ? [...violations, "no export returns a plugin"] : violations;
}

/**
 * Reports a plugin package that peers on nothing named vite.
 *
 * @remarks
 *   A plugin runs inside the consumer's Vite, so the consumer owns that dependency. A copy
 *   installed here would be a second Vite the plugin never meets.
 */
export function peer(published: Published): readonly string[] {
  return published.peerDependencies?.["vite"] === undefined
    ? ["a plugin package peers on nothing named vite"]
    : [];
}
