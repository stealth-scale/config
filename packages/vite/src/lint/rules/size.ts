/**
 * Size limits, standing in for whether a thing does one thing.
 */

import { type Rules } from "#lint/rules/rules.ts";

/**
 * How large a thing may get before it is two things.
 *
 * A file needing more than this is two files and a function needing more is two functions. The
 * numbers are not derived from anything: they are where the argument stops being worth having, and
 * a package needing one raised says so in its own override.
 */
export const SIZE: Rules = {
  complexity: ["error", 10],
  "max-depth": ["error", 4],
  "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],
  "max-lines-per-function": ["error", { max: 60, skipBlankLines: true, skipComments: true }],
  "max-params": ["error", 4],
};
