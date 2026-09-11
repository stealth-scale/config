/**
 * What is refused whatever the package does.
 */

import { type Rules } from "#lint/rules/rules.ts";

/**
 * The refusals every package carries.
 *
 * `no-console` allows the two streams a failure is reported on; a package whose output is the
 * console says so in an override rather than here.
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
