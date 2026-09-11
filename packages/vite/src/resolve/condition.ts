/**
 * The export condition every stealth repository resolves its own packages through.
 */

/**
 * Names the condition a workspace package publishes its source under.
 *
 * One name shared by every repository rather than one per repository, which is safe because the
 * packer writes a compiled-only export map when a package is published: nothing carrying this
 * condition reaches a registry, so an installed package matches nothing and falls through to
 * `default`.
 *
 * The same string is in `@stealthscale/config-typescript`'s `customConditions`, and a specification
 * asserts the two agree — the type checker resolves through one and the bundler through the other,
 * so a drift between them is a package whose types come from source while its values come from a
 * build.
 */
export const SOURCE = "stealth-source";
