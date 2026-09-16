/**
 * Refuses the constructs that hide a failure from the compiler or the reader.
 */

import { type Rules } from "#lint/rules/rules.ts";

/**
 * Denies the escapes from the type checker, and the logging nobody reads.
 *
 * @remarks
 *   `console.error` and `console.warn` stay, because those two streams are how
 *   a tool reports a failure to the console that started it. Anything else on
 *   `console` is debugging somebody forgot to take out.
 */
export const SAFETY: Rules = {
  "no-console": ["error", { allow: ["error", "warn"] }],
  "no-script-url": "error",

  // Both defeat the checker rather than satisfy it. `any` switches it off for everything the value
  // touches, where `unknown` keeps it on and asks for a narrowing; a non-null assertion claims
  // something the compiler could not prove, and is wrong exactly when it matters.
  "typescript/no-explicit-any": "error",
  "typescript/no-non-null-assertion": "error",

  // Off, and the exception that makes denying `pedantic` bearable. Deep readonly is unreachable
  // through a type this house does not own — a toolchain's config types are mutable — so a
  // parameter carrying one never satisfies the rule however it is written, and the finding says
  // nothing about the code. Parameters are still written `Readonly<…>`, as a convention rather
  // than something the linter can check.
  "typescript/prefer-readonly-parameter-types": "off",
};
