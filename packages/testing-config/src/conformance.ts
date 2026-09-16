/**
 * Runs every check a package's kind calls for and returns the violations as one list.
 *
 * The result is a list of sentences rather than a verdict, the way an audit reports. A
 * specification writes one assertion, and a failure names the export, the file or the layer and
 * what was expected of it. Nothing here asserts.
 */

import * as layer from "#layers.ts";
import * as manifest from "#manifest.ts";
import { type Arguments, factories, prefixOf, walked, type Walked } from "#module.ts";
import * as plugin from "#plugin.ts";
import * as readme from "#readme.ts";
import { composes, type Tiers } from "#tier.ts";

/**
 * One check the suite runs, named for what it reads and what it asks.
 */
export type Check =
  | "layer.kind"
  | "layer.named"
  | "layer.reasoned"
  | "layer.unique"
  | "manifest.engines"
  | "manifest.exports"
  | "manifest.files"
  | "manifest.peers"
  | "module.factories"
  | "plugin.named"
  | "plugin.peer"
  | "readme.exports"
  | "tier.composes";

/**
 * The package under test, and what the suite cannot work out on its own.
 */
export interface Conformance {
  /**
   * The arguments a factory needs, keyed by the path a consumer writes: `lint.relax`,
   * `server.port`. A factory with required parameters and no entry here is a violation.
   */
  readonly arguments?: Arguments | undefined;

  /**
   * The package directory, as an absolute path.
   */
  readonly at: string;

  /**
   * The kind of package.
   */
  readonly kind: manifest.Kind;

  /**
   * The package barrel, as returned by `await import("#index.ts")`.
   */
  readonly module: Readonly<Record<string, unknown>>;

  /**
   * The checks to run and no others. This narrows a failure and is never committed: the suite
   * reports it as a violation of its own when `CI` is set.
   */
  readonly only?: readonly Check[] | undefined;

  /**
   * The checks to leave out, each with a reason a reviewer can weigh.
   */
  readonly skip?: Readonly<Partial<Record<Check, string>>> | undefined;

  /**
   * The tier modules a config package publishes, keyed by subpath such as `preset/app`. Every
   * tier subpath in the manifest has to be here, so a tier added without an edit to the
   * specification is reported.
   */
  readonly tiers?: Tiers | undefined;
}

/**
 * The material every check reads.
 */
interface Reading {
  /**
   * The return value of each factory.
   */
  readonly found: readonly layer.Found[];

  /**
   * The prefix of the package's layer names.
   */
  readonly prefix: string;

  /**
   * The manifest.
   */
  readonly published: manifest.Published;

  /**
   * The package under test.
   */
  readonly stated: Conformance;

  /**
   * The walked barrel.
   */
  readonly walked: Walked;
}

/**
 * The checks selected for a run, and the violations in the selection itself.
 */
interface Selection {
  /**
   * The checks to run, in order.
   */
  readonly checks: readonly Check[];

  /**
   * Each violation in how the checks were selected.
   */
  readonly violations: readonly string[];
}

/**
 * One check as a function of the material it reads.
 */
type Runner = (reading: Reading) => Promise<readonly string[]> | readonly string[];

/**
 * The checks in the order they run, and the kinds each runs for.
 */
const RUNS: ReadonlyArray<readonly [Check, readonly manifest.Kind[]]> = [
  ["manifest.exports", ["config", "library", "plugin"]],
  ["manifest.files", ["config", "library", "plugin"]],
  ["manifest.engines", ["config", "library", "plugin"]],
  ["manifest.peers", ["config", "library", "plugin"]],
  ["module.factories", ["config"]],
  ["readme.exports", ["config"]],
  ["layer.kind", ["config"]],
  ["layer.named", ["config"]],
  ["layer.reasoned", ["config"]],
  ["layer.unique", ["config"]],
  ["tier.composes", ["config"]],
  ["plugin.named", ["plugin"]],
  ["plugin.peer", ["plugin"]],
];

/**
 * The runner for each check.
 */
const RUNNERS: Readonly<Record<Check, Runner>> = {
  "layer.kind": ({ found }) => layer.kind(found),
  "layer.named": ({ found, prefix }) => layer.named(found, prefix),
  "layer.reasoned": ({ found }) => layer.reasoned(found),
  "layer.unique": ({ found }) => layer.unique(found),
  "manifest.engines": ({ published, stated }) => manifest.engines(published, stated.at),
  "manifest.exports": ({ published, stated }) => manifest.exports(published, stated.at),
  "manifest.files": ({ published, stated }) => manifest.files(published, stated.at),
  "manifest.peers": ({ published, stated }) => manifest.peers(published, stated.kind),
  "module.factories": ({ stated, walked: barrel }) => factories(barrel, stated.arguments ?? {}),
  "plugin.named": ({ stated }) => plugin.named(stated.module, stated.arguments ?? {}),
  "plugin.peer": ({ published }) => plugin.peer(published),
  "readme.exports": ({ stated, walked: barrel }) => readme.exports(stated.at, barrel.namespaces),
  "tier.composes": ({ published, stated }) => composes(published, stated.tiers ?? {}, stated.at),
};

/**
 * Selects the checks to run for a package, and reports what is wrong with the selection.
 *
 * @param stated - The package under test.
 * @returns The checks in run order, and each violation in the selection.
 */
function selected(stated: Conformance): Selection {
  const flagged: string[] = [];

  if (stated.only !== undefined && process.env["CI"] !== undefined) {
    flagged.push("only is set in a specification running under CI");
  }

  for (const [check, because] of Object.entries(stated.skip ?? {})) {
    if (because.trim() === "") flagged.push(`skip of ${check} gives no reason`);
  }

  const checks = RUNS.filter(
    ([check, kinds]) =>
      kinds.includes(stated.kind) &&
      (stated.only === undefined || stated.only.includes(check)) &&
      stated.skip?.[check] === undefined,
  ).map(([check]) => check);

  return { checks, violations: flagged };
}

/**
 * Finds every part of the contract a package breaks.
 *
 * Each violation is one sentence prefixed with the check that found it. The list is empty for a
 * package that conforms.
 *
 * @param stated - The package under test. `Conformance` documents every member.
 * @returns Each violation, in the order the checks run.
 */
export async function violations(stated: Conformance): Promise<readonly string[]> {
  const selection = selected(stated);
  const published = manifest.publishedOf(stated.at);
  const supplied = stated.arguments ?? {};
  const barrel = walked(stated.module, supplied);
  const reading: Reading = {
    found: stated.kind === "config" ? layer.layersOf(barrel.factories, supplied) : [],
    prefix: prefixOf(published.name),
    published,
    stated,
    walked: barrel,
  };
  const reported = await Promise.all(
    selection.checks.map(async (check) =>
      (await RUNNERS[check](reading)).map((violation) => `${check}: ${violation}`),
    ),
  );

  return [...selection.violations, ...reported.flat()];
}
