/* eslint-disable no-underscore-dangle -- a substitution's name must be unmistakable in source text */

/**
 * The constants `define` injects, declared so that reading one type-checks.
 *
 * A package reaches these by referencing this file's types from one it already compiles, with a
 * triple-slash directive naming `@stealthscale/config-vite/globals`.
 *
 * Each is a substitution the bundler makes rather than a variable, so it exists only in a build
 * this config configured. A package reading one without that reference gets a type error, which is
 * the intended answer: nothing here is available by accident.
 */

/**
 * What the package is published as, from its own manifest.
 */
declare const __NAME__: string;

/**
 * What the package is published at, from its own manifest.
 */
declare const __VERSION__: string;

/**
 * The revision the build ran against, where the package asked for it.
 *
 * Empty where there was no repository to ask, which a build from a published tarball has not.
 */
declare const __COMMIT__: string;

/**
 * When the build ran, as an ISO 8601 string, where the package asked for it.
 */
declare const __BUILT_AT__: string;
