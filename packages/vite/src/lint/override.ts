/**
 * The relaxations a path earns, as entries of the `lint` block's `overrides`.
 */

import { type UserConfig } from "vite-plus";

import { contribute, type Contribution } from "#core/layer.ts";
import { docblocksOff } from "#lint/rules/docblock.ts";

/**
 * The `lint` block of a config.
 */
type LintBlock = NonNullable<UserConfig["lint"]>;

/**
 * One entry of that block's `overrides`.
 */
export type LintOverride = NonNullable<LintBlock["overrides"]>[number];

/**
 * Where an override is appended.
 */
const AT = "lint.overrides";

/**
 * Describes a tier and what it may not reach for.
 */
export interface Forbidden {
  /**
   * Why the tier may not, shown wherever the rule fires.
   */
  because: string;

  /**
   * What it may import anyway, out of what `packages` matches.
   */
  except?: readonly string[] | undefined;

  /**
   * The globs the tier holds.
   */
  files: readonly string[];

  /**
   * The import patterns it may not use.
   */
  packages: readonly string[];
}

/**
 * Describes a path and the rules that change for it.
 */
export interface Ruled {
  /**
   * Why these files are exceptional.
   */
  because: string;

  /**
   * The globs the change applies to.
   */
  files: readonly string[];

  /**
   * The rules, against what the linter should do about them instead.
   */
  rules: Readonly<Record<string, unknown>>;
}

/**
 * Refuses a tier the imports it may not reach for.
 *
 * A layering rule stated as something the linter checks, so a package reaching upward fails before
 * anybody reads the diff. The reason travels with the rule and is what the author sees, which is
 * the difference between a refusal somebody can act on and one they work around.
 *
 * @param stated - The tier, and what it may not import. `Forbidden` documents every member.
 * @returns The contribution.
 */
export function forbid(stated: Forbidden): Contribution {
  const group = [...stated.packages, ...(stated.except ?? []).map((name) => `!${name}`)];

  return contribute({
    at: AT,
    because: stated.because,
    item: {
      files: [...stated.files],
      rules: {
        "no-restricted-imports": ["error", { patterns: [{ group, message: stated.because }] }],
      },
    },
    name: `lint.forbid(${stated.files.join(", ")})`,
  });
}

/**
 * Appends an override changing the rules for a set of paths.
 *
 * @param stated - The paths, and the rules that change for them.
 * @param name - The contribution's name, which is what a removal asks for.
 * @returns The contribution.
 */
function changing(stated: Ruled, name: string): Contribution {
  return contribute({
    at: AT,
    because: stated.because,
    item: { files: [...stated.files], rules: { ...stated.rules } },
    name: `${name}(${stated.files.join(", ")})`,
  });
}

/**
 * Changes what the linter asks of one set of paths.
 *
 * The escape hatch for a file whose nature makes a rule inapplicable rather than inconvenient. A
 * reason is required because that distinction is the whole of it, and only the person writing the
 * override knows which one this is.
 *
 * @param stated - The paths, and the rules that change for them. `Ruled` documents every member.
 * @returns The contribution.
 */
export function relax(stated: Ruled): Contribution {
  return changing(stated, "lint.relax");
}

/**
 * Asks more of one set of paths than of the rest.
 *
 * The counterpart to `relax`, and the same mechanism: what separates them is which direction the
 * change goes, which is the one thing a later reader needs and the one thing the name can carry. A
 * framework package uses this to hold the files it renders to rules that mean nothing anywhere
 * else.
 *
 * @param stated - The paths, and the rules they answer to. `Ruled` documents every member.
 * @returns The contribution.
 */
export function enforce(stated: Ruled): Contribution {
  return changing(stated, "lint.enforce");
}

/**
 * Excuses what a tool reads by its default export.
 *
 * Which files those are is the caller's to say: a config everywhere, a story file or a route module
 * only where the repository keeps them.
 *
 * @param files - The globs read by a default export.
 * @returns The contribution.
 */
export function defaultExported(files: readonly string[]): Contribution {
  return relax({
    because: "read by its default export, so it has nowhere else to put one",
    files,
    rules: { "no-default-export": "off" },
  });
}

/**
 * Excuses a specification the rule against asserting a type.
 *
 * A specification reads back what a function answered, and what it answered is often deliberately
 * opaque — a branded layer, a config the toolchain types loosely. Narrowing it is how the assertion
 * gets made at all, and the narrowing is checked by the test failing rather than by the compiler.
 *
 * @param files - The globs holding specifications.
 * @returns The contribution.
 */
export function undocumented(files: readonly string[]): Contribution {
  return relax({
    because: "a specification is documented by its own test names, and narrows what it reads back",
    files,
    rules: { ...docblocksOff(), "typescript/no-unsafe-type-assertion": "off" },
  });
}
