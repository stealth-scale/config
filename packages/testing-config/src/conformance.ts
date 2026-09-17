/**
 * Selects the checks a package kind is subject to and labels each violation with its check.
 *
 * @remarks
 *   Every selected check runs, and a breach found by one never stops another, so a specification
 *   reports the whole set in a single run. Skipping a check costs a written reason, and pinning
 *   the run to `only` is itself a violation under CI.
 */

import * as layer from "#layers.ts";
import * as manifest from "#manifest.ts";
import { type Arguments, factories, prefixOf, walked, type Walked } from "#module.ts";
import * as plugin from "#plugin.ts";
import * as readme from "#readme.ts";
import * as source from "#source.ts";
import { composes, type Tiers } from "#tier.ts";

/**
 * Enumerates every check a specification can select, skip, or see quoted in a violation.
 *
 * @remarks
 *   The part in front of the dot is the area a check reads, and it opens every sentence that
 *   check reports.
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
  | "source.specs"
  | "tier.composes";

/**
 * Describes the package under test and which checks the specification runs over it.
 *
 * @remarks
 *   Everything a check cannot work out for itself is named here, so a factory needing arguments
 *   or a tier needing an import is supplied rather than guessed at.
 */
export interface Conformance {
  /**
   * The arguments each factory with required parameters is called with, keyed by its path in the
   * barrel.
   */
  readonly arguments?: Arguments | undefined;

  /**
   * The directory holding the package's manifest.
   */
  readonly at: string;

  /**
   * Which contract the package is held to.
   */
  readonly kind: manifest.Kind;

  /**
   * The barrel, already imported by the specification that runs the checks.
   */
  readonly module: Readonly<Record<string, unknown>>;

  /**
   * The checks to run to the exclusion of the rest, for narrowing a failure by hand.
   */
  readonly only?: readonly Check[] | undefined;

  /**
   * The checks to leave out, each against the reason it is left out.
   */
  readonly skip?: Readonly<Partial<Record<Check, string>>> | undefined;

  /**
   * The tier modules the package publishes, keyed by subpath such as `preset/app`.
   */
  readonly tiers?: Tiers | undefined;
}

/**
 * Carries everything the checks read, gathered once before the first of them runs.
 *
 * @remarks
 *   Each factory is called here rather than inside a check, so the four layer checks agree on
 *   what a factory returned and a factory with a side effect performs it once.
 */
interface Reading {
  /**
   * Records what each factory that could be called returned.
   */
  readonly found: readonly layer.Found[];

  /**
   * The prefix the package's layer names carry, empty for the base config.
   */
  readonly prefix: string;

  /**
   * The parsed manifest.
   */
  readonly published: manifest.Published;

  /**
   * The caller's own request, kept for the fields a check reads back from it.
   */
  readonly stated: Conformance;

  /**
   * The barrel split into factories, namespaces and exports that are neither.
   */
  readonly walked: Walked;
}

/**
 * Pairs the checks that will run with what the selection itself found wrong.
 *
 * @remarks
 *   A specification can break the contract before a check runs, by skipping without a reason or
 *   by pinning `only` under CI. Those violations belong to no check and carry no prefix.
 */
interface Selection {
  /**
   * The checks to run, in the order they are declared.
   */
  readonly checks: readonly Check[];

  /**
   * Lists the breaches in the request rather than in the package.
   */
  readonly violations: readonly string[];
}

/**
 * Runs one check over the gathered reading and reports what it found.
 *
 * @remarks
 *   A runner reports a breach rather than throwing on one, so a package that fails one check is
 *   still measured by the rest. Returning synchronously is allowed, and the caller awaits either
 *   form.
 */
type Runner = (reading: Reading) => Promise<readonly string[]> | readonly string[];

/**
 * Lists every check against the kinds of package it applies to, in the order they report.
 */
const RUNS: ReadonlyArray<readonly [Check, readonly manifest.Kind[]]> = [
  ["manifest.exports", ["config", "library", "plugin"]],
  ["manifest.files", ["config", "library", "plugin"]],
  ["manifest.engines", ["config", "library", "plugin"]],
  ["manifest.peers", ["config", "library", "plugin"]],
  ["module.factories", ["config"]],
  ["readme.exports", ["config"]],
  ["source.specs", ["config", "library", "plugin"]],
  ["layer.kind", ["config"]],
  ["layer.named", ["config"]],
  ["layer.reasoned", ["config"]],
  ["layer.unique", ["config"]],
  ["tier.composes", ["config"]],
  ["plugin.named", ["plugin"]],
  ["plugin.peer", ["plugin"]],
];

/**
 * Maps each check to the call that performs it.
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
  "source.specs": ({ stated }) => source.specs(stated.at),
  "tier.composes": ({ published, stated }) => composes(published, stated.tiers ?? {}, stated.at),
};

/**
 * Works out which checks to run, and what the request itself gets wrong.
 *
 * @remarks
 *   A kind that does not list a check drops it without a word, because a library has no barrel to
 *   walk. A check the caller takes out by hand is the one that has to be justified.
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
 * Runs every check the package kind and the caller's selection leave standing.
 *
 * @remarks
 *   The manifest is read, the barrel walked and the factories called before the first check, so a
 *   barrel that cannot be walked fails on the walk rather than under one check's name. Factories
 *   are called for a config package and for nothing else.
 * @returns Each violation, opening with the check that reported it, or an empty array for a
 *   package that keeps the contract.
 * @throws {@link Error} When the manifest at `at` is missing or is not JSON.
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
