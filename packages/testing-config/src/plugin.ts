/**
 * Checks that a plugin package exports one plugin named for the house and peers on what runs it.
 */

import { reason } from "#layers.ts";
import { type Published } from "#manifest.ts";
import { type Arguments, callable, record } from "#module.ts";

/**
 * The prefix every plugin name starts with.
 */
const HOUSE = "stealth:";

/**
 * The two hooks a plugin built on the house base has.
 */
const HOOKS = ["configResolved", "generateBundle"];

/**
 * Checks one plugin a factory returned.
 *
 * @param path - The factory name.
 * @param plugin - The plugin the factory returned.
 * @returns Each violation.
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
 * Calls one function on the barrel when it can be called.
 *
 * @param path - The function name.
 * @param call - The function to call.
 * @param supplied - The arguments the specification supplies, keyed by path.
 * @returns The return value, an `Error` when the call threw, or `undefined` when the function has
 *   required parameters and no entry in `arguments`.
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
 * Checks that the barrel exports a function returning a plugin, and that each plugin returned is
 * named for its factory and built on the house base.
 *
 * A function with required parameters and no entry in `arguments` is a helper and is not called.
 *
 * @param module - The barrel.
 * @param supplied - The arguments the specification supplies, keyed by path.
 * @returns Each violation.
 */
export function named(
  module: Readonly<Record<string, unknown>>,
  supplied: Arguments,
): readonly string[] {
  const violations: string[] = [];
  let plugins = 0;

  for (const [path, value] of Object.entries(module)) {
    if (!callable(value)) continue;

    const result = returned(path, value, supplied);

    if (result instanceof Error) violations.push(`${path} throws when called: ${result.message}`);
    else if (record(result) && typeof result["name"] === "string") {
      plugins += 1;
      violations.push(...shaped(path, result));
    }
  }

  return plugins === 0 ? [...violations, "no export returns a plugin"] : violations;
}

/**
 * Checks that a plugin package peers on `vite`.
 *
 * Kept apart from the manifest's peer check, so a plugin's specification can skip one half with a
 * reason and keep the other.
 *
 * @param published - The manifest to check.
 * @returns Each violation.
 */
export function peer(published: Published): readonly string[] {
  return published.peerDependencies?.["vite"] === undefined
    ? ["a plugin package peers on nothing named vite"]
    : [];
}
