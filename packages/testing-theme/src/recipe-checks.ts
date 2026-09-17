/**
 * Checks a recipe for the values it may not write: a color a theme cannot move, a token nothing
 * defines, a condition nothing defines, a pixel length, a color mode, a slot the anatomy does not
 * stamp, and the one ink that clears the boundary ratio and not the text ratio.
 *
 * @remarks
 *   A recipe reads semantic tokens, compositions and scale steps, so a theme can move every value
 *   it draws. A value the foundation does not define reaches the page as raw CSS without a word
 *   from the compiler, so the token check is what catches a name typed wrongly.
 */

import { HUES, PALETTES, type Preset, ROLES } from "@stealthscale/theme/authoring";
import foundation from "@stealthscale/theme/theme";

import { conditionNames, semanticColorPaths, tokenPaths } from "#categories.ts";
import { type Declared } from "#recipe.ts";
import { walked, type Walked, type Written } from "#walk.ts";

/**
 * Enumerates every check a recipe specification can select or skip.
 */
export type RecipeCheck =
  | "recipe.className"
  | "recipe.colors"
  | "recipe.conditions"
  | "recipe.lengths"
  | "recipe.modes"
  | "recipe.slots"
  | "recipe.subtle"
  | "recipe.tokens";

/**
 * Describes what a recipe specification states beside the recipe.
 */
export interface RecipeChecks {
  /**
   * Property names whose values are allowed a length with a unit.
   */
  lengths?: readonly string[] | undefined;

  /**
   * The parts the anatomy stamps, compared against the recipe's slots.
   */
  parts?: readonly string[] | undefined;

  /**
   * The preset the recipe is written against, read for its tokens and conditions. The foundation
   * unless named.
   */
  preset?: Preset | undefined;

  /**
   * The checks to leave out, each with a reason a reviewer can weigh.
   */
  skip?: Readonly<Partial<Record<RecipeCheck, string>>> | undefined;
}

/**
 * Matches a class name a stylesheet and a specification can both write.
 */
const CLASS_NAME = /^[a-z][a-z0-9-]*$/u;

/**
 * Lists the conditions that switch on the color mode, which a recipe never writes.
 */
const MODE_CONDITIONS = new Set(["_dark", "_light", "_osDark", "_osLight"]);

/**
 * Matches a length in one of the units a theme cannot move.
 */
const LENGTH = /(?:^|[\s(,])-?\d*\.?\d+(?:px|rem|pt)(?![\w-])/u;

/**
 * Matches a color written outright.
 */
const LITERAL = /^(?:#|(?:oklch|oklab|rgba?|hsla?|lab|lch|color)\()/iu;

/**
 * Matches a step of a ramp, such as `blue.500`.
 */
const STEP = /^[a-zA-Z]+\.\d+$/u;

/**
 * Matches a value that is not a color: a keyword every property takes, or a custom property a
 * runtime value is written into.
 */
const PASSES = /^(?:transparent|current|currentColor|inherit|initial|unset|none|var\(--)/u;

/**
 * Matches a value that names a token: a dotted path, or the compiler's token function anywhere
 * in the value.
 */
const TOKEN = /^[a-zA-Z][\w-]*(?:\.[\w-]+)+$|token\(/u;

/**
 * Matches the category and the path inside the compiler's token function, wherever it is in the
 * value.
 */
const TOKEN_CALL = /token\(([a-zA-Z]+)\.([^,)]+)/u;

/**
 * Lists the three categories a value reads by name alone, so every value has to exist.
 */
const COMPOSITIONS = new Set(["animationStyles", "layerStyles", "textStyles"]);

/**
 * Fixes the virtual palette a recipe reads roles through.
 */
const VIRTUAL = "colorPalette";

/**
 * Fixes the ink held to the boundary ratio, which no recipe writes as a text color.
 */
const SUBTLE = "fg.subtle";

/**
 * Strips the opacity modifier a color may carry, such as `fg/50`.
 */
function bare(value: string): string {
  return value.replace(/\/\d+$/u, "");
}

/**
 * Says what is wrong with a color value, or nothing where a theme can move it.
 */
function colorFault(value: string, preset: Preset): string | undefined {
  const named = bare(value);
  const [first = "", ...rest] = named.split(".");

  if (PASSES.test(named)) return undefined;
  if (LITERAL.test(named)) return `writes the color ${value}`;
  if (named.startsWith("{")) return `references ${value}`;
  if (STEP.test(named)) return `names the ramp step ${value}`;
  if (first === VIRTUAL) {
    return ROLES.some((role) => role === rest.join("."))
      ? undefined
      : `reads ${value}, which is not a role of the palette`;
  }
  if (HUES.some((hue) => hue === first)) return `names the hue ${value}`;
  if (semanticColorPaths(preset).has(named)) return undefined;

  return `names ${value}, which is not a semantic color token`;
}

/**
 * Reports every color a recipe writes that a theme cannot move, and every palette that is a hue
 * rather than an intent.
 */
function colorViolations(
  recipe: Declared,
  found: readonly Written[],
  preset: Preset,
): readonly string[] {
  return found.flatMap(({ path, property, value }) => {
    if (property === VIRTUAL) {
      return PALETTES.some((palette) => palette === value)
        ? []
        : [
            `${recipe.className} points colorPalette at ${value} at ${path}, and a recipe names an intent`,
          ];
    }

    const fault = colorFault(value, preset);

    return fault === undefined ? [] : [`${recipe.className} ${fault} at ${path}`];
  });
}

/**
 * Says what is wrong with a token a value names, or nothing where the preset defines it.
 */
function tokenFault(category: string, value: string, preset: Preset): string | undefined {
  const call = TOKEN_CALL.exec(value);

  if (call !== null) {
    const [called, path] = call.slice(1);

    return tokenPaths(String(called), preset).has(String(path))
      ? undefined
      : `names ${value}, which is not a ${String(called)} token`;
  }

  if (!TOKEN.test(value) && !COMPOSITIONS.has(category)) return undefined;

  return tokenPaths(category, preset).has(bare(value))
    ? undefined
    : `names ${value}, which is not a ${category} token`;
}

/**
 * Reports every token a recipe names that the preset does not define.
 */
function tokenViolations(
  recipe: Declared,
  found: readonly Written[],
  preset: Preset,
): readonly string[] {
  return found.flatMap(({ category, path, value }) => {
    if (category === undefined || category === "colors") return [];

    const fault = tokenFault(category, value, preset);

    return fault === undefined ? [] : [`${recipe.className} ${fault} at ${path}`];
  });
}

/**
 * Reports every condition a recipe nests under that nothing defines.
 */
function conditionViolations(recipe: Declared, found: Walked, preset: Preset): readonly string[] {
  const known = conditionNames(preset);

  return found.conditions
    .filter(({ condition }) => !known.has(condition.slice(1)))
    .map(
      ({ condition, path }) =>
        `${recipe.className} nests under ${condition} at ${path}, which is not a condition`,
    );
}

/**
 * Reports every length a recipe writes in a unit a theme cannot move.
 */
function lengthViolations(
  recipe: Declared,
  found: readonly Written[],
  allowed: readonly string[],
): readonly string[] {
  return found.flatMap(({ path, property, value }) =>
    property !== undefined && !allowed.includes(property) && LENGTH.test(value)
      ? [`${recipe.className} sets ${property} to ${value} at ${path}, a length in px, rem or pt`]
      : [],
  );
}

/**
 * Reports every color mode a recipe switches on.
 */
function modeViolations(recipe: Declared, found: Walked): readonly string[] {
  return found.conditions
    .filter(({ condition }) => MODE_CONDITIONS.has(condition))
    .map(({ path }) => `${recipe.className} switches on the color mode at ${path}`);
}

/**
 * Reports a slot the anatomy stamps no part for, and a part no slot styles.
 */
function slotViolations(recipe: Declared, parts: readonly string[]): readonly string[] {
  const styled = recipe.slots ?? [];
  const unstamped = styled
    .filter((slot) => !parts.includes(slot))
    .map((slot) => `${recipe.className} styles ${slot}, which the anatomy stamps no part for`);
  const unstyled = parts
    .filter((part) => !styled.includes(part))
    .map((part) => `${recipe.className} styles no slot for the part ${part}`);

  return unstamped.concat(unstyled);
}

/**
 * Reports every place the subtle ink is written as a text color.
 */
function subtleViolations(recipe: Declared, found: readonly Written[]): readonly string[] {
  return found
    .filter(({ property, value }) => property === "color" && bare(value) === SUBTLE)
    .map(
      ({ path }) =>
        `${recipe.className} sets color to ${SUBTLE} at ${path}, which clears the boundary ratio and not the text ratio`,
    );
}

/**
 * Runs one check and reports what it found.
 */
type Runner = (
  recipe: Declared,
  found: Walked,
  options: RecipeChecks,
  preset: Preset,
) => readonly string[];

/**
 * Maps each check to the call that performs it, in the order they report.
 */
const RUNNERS: ReadonlyArray<readonly [RecipeCheck, Runner]> = [
  [
    "recipe.className",
    (recipe) =>
      CLASS_NAME.test(recipe.className)
        ? []
        : [`${recipe.className} is not a class name in kebab case`],
  ],
  [
    "recipe.colors",
    (recipe, found, _options, preset) =>
      colorViolations(
        recipe,
        found.strings.filter(({ category }) => category === "colors"),
        preset,
      ),
  ],
  [
    "recipe.tokens",
    (recipe, found, _options, preset) => tokenViolations(recipe, found.strings, preset),
  ],
  [
    "recipe.conditions",
    (recipe, found, _options, preset) => conditionViolations(recipe, found, preset),
  ],
  [
    "recipe.lengths",
    (recipe, found, options) => lengthViolations(recipe, found.strings, options.lengths ?? []),
  ],
  ["recipe.modes", (recipe, found) => modeViolations(recipe, found)],
  [
    "recipe.slots",
    (recipe, _found, options) =>
      options.parts === undefined ? [] : slotViolations(recipe, options.parts),
  ],
  ["recipe.subtle", (recipe, found) => subtleViolations(recipe, found.strings)],
];

/**
 * Reports a skip that gives no reason.
 */
function unreasoned(options: RecipeChecks): readonly string[] {
  return Object.entries(options.skip ?? {})
    .filter(([, because]) => because.trim() === "")
    .map(([check]) => `skip of ${check} gives no reason`);
}

/**
 * Runs every check the specification leaves standing over a recipe.
 *
 * @returns Each violation, opening with the check that reported it, or an empty array for a
 *   recipe a theme can move every value of.
 */
export function recipeViolations(recipe: Declared, options: RecipeChecks = {}): readonly string[] {
  const found = walked(recipe);
  const preset = options.preset ?? foundation;
  const reported = RUNNERS.filter(([check]) => options.skip?.[check] === undefined).flatMap(
    ([check, run]) =>
      run(recipe, found, options, preset).map((violation) => `${check}: ${violation}`),
  );

  return unreasoned(options).concat(reported);
}
