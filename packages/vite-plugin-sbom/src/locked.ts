/**
 * Where each package came from, which only the lockfile knows.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * What a lockfile records about one installed package.
 */
export interface Installed {
  /**
   * Its subresource integrity, as `sha512-<base64>`.
   */
  integrity?: string;

  /**
   * The registry it came from, where that is not the default one.
   */
  registry?: string;

  /**
   * How it was asked for, where that was not a plain version: `github:owner/repo#sha`, a git
   * remote, a tarball URL, a path.
   */
  resolution?: string;
}

/**
 * Reads one package manager's lockfile.
 *
 * Answers nothing where that manager's lockfile is not the one in this repository, which is what
 * lets the readers be tried in turn.
 */
type Reader = (root: string) => ReadonlyMap<string, Installed> | undefined;

/**
 * Reads a lockfile that allows trailing commas, which `bun.lock` does.
 *
 * @param at - The file to read.
 * @returns Its contents, or nothing where it cannot be read or parsed.
 */
function relaxed(at: string): unknown {
  try {
    return JSON.parse(readFileSync(at, "utf8").replaceAll(/,(?=\s*[\]}])/gu, ""));
  } catch {
    return undefined;
  }
}

/**
 * Answers whether a string is a subresource integrity.
 *
 * @param held - The value to test.
 * @returns Whether it names a hash.
 */
function integral(held: unknown): held is string {
  return typeof held === "string" && /^sha\d{3}-/u.test(held);
}

/**
 * Reads one of `bun.lock`'s package entries.
 *
 * The entry is a tuple whose shape differs by where the package came from: a registry package
 * carries its registry in the second slot, a git one carries its dependencies there instead. Read
 * by what each slot holds rather than by position, since position is not stable between the two.
 *
 * @param held - The entry, as the lockfile holds it.
 * @returns The package's name against what the entry records, or nothing where it is unreadable.
 */
function entry(held: readonly unknown[]): readonly [string, Installed] | undefined {
  const first = held[0];

  if (typeof first !== "string") return undefined;

  const at = first.lastIndexOf("@");

  if (at < 1) return undefined;

  const last = held.at(-1);
  const second = held[1];

  return [
    first.slice(0, at),
    {
      ...(integral(last) ? { integrity: last } : {}),
      ...(typeof second === "string" && second !== "" && !integral(second)
        ? { registry: second }
        : {}),
      resolution: first.slice(at + 1),
    },
  ];
}

/**
 * Reads `bun.lock`.
 *
 * Bun writes no install metadata into the packages themselves — no `_resolved`, no `dist` — so the
 * lockfile is the only place recording where anything came from.
 *
 * @param root - The workspace root.
 * @returns Each package it records, or nothing where this workspace is not bun's.
 */
function bun(root: string): ReadonlyMap<string, Installed> | undefined {
  const at = join(root, "bun.lock");

  if (!existsSync(at)) return undefined;

  const held = relaxed(at);
  const packages: unknown =
    typeof held === "object" && held !== null ? Reflect.get(held, "packages") : undefined;

  if (typeof packages !== "object" || packages === null) return new Map();

  const found = new Map<string, Installed>();

  for (const one of Object.values<unknown>(Object.fromEntries(Object.entries(packages)))) {
    const read = Array.isArray(one) ? entry(one) : undefined;

    if (read !== undefined) found.set(read[0], read[1]);
  }

  return found;
}

/**
 * The lockfiles this knows how to read, tried in turn.
 *
 * One function each, answering nothing where its own lockfile is absent. Another manager is another
 * entry here: pnpm's lockfile is YAML and npm's is a nested tree, so each needs its own reading,
 * and neither needs anything else to change.
 */
const READERS: readonly Reader[] = [bun];

/**
 * Finds the workspace root above a package, which is where a lockfile sits.
 *
 * @param from - The package's directory.
 * @returns The nearest directory holding a lockfile this can read, or nothing.
 */
function rooted(from: string): string | undefined {
  for (let at = from; ;) {
    if (READERS.some((read) => read(at) !== undefined)) return at;

    const up = dirname(at);

    if (up === at) return undefined;

    at = up;
  }
}

/**
 * Reads what the repository's lockfile says about every package in it.
 *
 * A manifest cannot answer this. It says what a package is, not where this copy of it came from,
 * and the difference is what tells a public package apart from one of the same name inside a
 * company registry — which a scanner would otherwise look up and answer about the wrong thing.
 *
 * @param from - Any directory inside the workspace.
 * @returns Each package's install record, by name, or an empty map where no lockfile was found.
 */
export function locked(from: string): ReadonlyMap<string, Installed> {
  const root = rooted(from);

  for (const read of READERS) {
    const held = root === undefined ? undefined : read(root);

    if (held !== undefined) return held;
  }

  return new Map();
}
