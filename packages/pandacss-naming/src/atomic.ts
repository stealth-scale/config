/**
 * Rewrites the class the compiler writes for one style declaration into the scheme.
 *
 * @remarks
 *   A class is the conditions, outer to inner, then the utility, joined by a colon. A named
 *   condition is written in kebab-case. A raw selector or at-rule condition, which the compiler
 *   wraps in brackets, is kept as written, because a scheme for a selector would not read better
 *   than the selector. The utility's first word is the property's class and is written in
 *   kebab-case. The rest is the value, which keeps its case because a token name is
 *   case-sensitive.
 */

import { kebab, sanitise } from "#sanitise.ts";

/**
 * Joins the conditions and the utility of a class, and appears inside a raw condition as well.
 */
const JOIN = ":";

/**
 * Opens a raw selector or at-rule condition, and closes it with `]`.
 */
const OPEN = "[";

/**
 * Matches the property's class at the start of a utility, up to its first hyphen.
 */
const PROPERTY = /^[^-]+/u;

/**
 * Describes a class split into its conditions and its utility.
 */
interface Segments {
  /**
   * The conditions, outer to inner, as the compiler wrote them.
   */
  conditions: string[];
  /**
   * The property's class and the value, as the compiler wrote them.
   */
  utility: string;
}

/**
 * Splits a class into its conditions and its utility at each colon outside brackets.
 */
function segments(pandaClass: string): Segments {
  const conditions: string[] = [];
  let depth = 0;
  let from = 0;

  for (let at = 0; at < pandaClass.length; at += 1) {
    const char = pandaClass.charAt(at);

    if (char === OPEN) depth += 1;
    else if (char === "]") depth -= 1;
    else if (char === JOIN && depth === 0) {
      conditions.push(pandaClass.slice(from, at));
      from = at + 1;
    }
  }

  return { conditions, utility: pandaClass.slice(from) };
}

/**
 * Lists the conditions of a class, outer to inner, as the compiler wrote them.
 *
 * @returns Each condition, a raw one in its brackets, or an empty array for a class without one.
 */
export function conditionsOf(pandaClass: string): string[] {
  return segments(pandaClass).conditions;
}

/**
 * Rewrites a condition: a raw selector or at-rule stays as written, and a named condition is
 * written in kebab-case.
 */
function condition(segment: string): string {
  return segment.startsWith(OPEN) ? segment : kebab(segment);
}

/**
 * Rewrites the class the compiler writes for one declaration, conditions included, into the
 * scheme.
 *
 * @remarks
 *   A class with nothing to replace is returned as it is, so a recipe class the scheme has already
 *   written passes through unchanged.
 */
export function atomicClass(pandaClass: string): string {
  const { conditions, utility } = segments(pandaClass);

  return [
    ...conditions.map((segment) => condition(segment)),
    sanitise(utility.replace(PROPERTY, (property) => kebab(property))),
  ].join(JOIN);
}
