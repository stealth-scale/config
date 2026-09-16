/**
 * Declares the build-time substitutions a package in this repository may read.
 */

/* eslint-disable no-underscore-dangle -- a substitution's name must be unmistakable in source text */

/**
 * The name of the package being built, taken from its manifest.
 *
 * @remarks
 *   A manifest with no name substitutes the empty string, because a
 *   substitution that resolved to nothing would leave the identifier in the
 *   output for the runtime to fail on.
 */
declare const __NAME__: string;

/**
 * The version of the package being built, taken from its manifest.
 */
declare const __VERSION__: string;

/**
 * The git commit the build was made from.
 *
 * @remarks
 *   The value is substituted only where a build asked for it, and is the empty
 *   string where the environment offered no commit. Reading it in a package
 *   that did not ask leaves the identifier undefined at runtime.
 */
declare const __COMMIT__: string;

/**
 * The moment the build ran, as an ISO 8601 timestamp.
 *
 * @remarks
 *   Every build stamps a different value, so an artefact carrying this one is
 *   never byte-identical to the last. A package that needs a reproducible build
 *   leaves it out.
 */
declare const __BUILT_AT__: string;
