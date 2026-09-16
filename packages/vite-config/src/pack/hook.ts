/**
 * Schedules code to run at a named moment of the packer's build.
 */

import { named, type Override, override } from "@stealthscale/vite-config-core";

import { type Moments } from "#pack/settings.ts";

/**
 * Carries a set of moments together with the reason a package scheduled them.
 */
export interface Hooked {
  /**
   * Explains what the package needs the hook for, and shows up wherever layers are reported.
   */
  because: string;

  /**
   * Supplies the code to run at each moment the packer reaches.
   */
  hooks: Moments;
}

/**
 * Merges the stated moments into whatever the configuration has already scheduled.
 *
 * @remarks
 *   A moment another layer has already taken is replaced, and every other moment survives. Hooks
 *   stated as a registrar function are discarded rather than merged, and so is a `pack` field
 *   holding the multi-bundle array form.
 */
export function hook(stated: Hooked): Override {
  return override({
    because: stated.because,
    name: `pack.hook(${Object.keys(stated.hooks).join(", ")})`,
    refine: (_context, config) => {
      const held = Array.isArray(config.pack) ? undefined : config.pack;
      const already: Moments = typeof held?.hooks === "object" ? held.hooks : {};

      return { ...config, pack: { ...held, hooks: { ...already, ...stated.hooks } } };
    },
  });
}

/**
 * Resolves to the function the packer calls at one moment.
 *
 * @remarks
 *   Every moment is optional on the packer's own type. Stripping the undefined lets a caller state
 *   a moment without narrowing the result before passing it on.
 * @typeParam At - The moment whose signature is wanted.
 */
export type Runs<At extends keyof Moments> = NonNullable<Moments[At]>;

/**
 * Carries the code for a single moment and the reason for scheduling it.
 *
 * @typeParam At - The moment the code runs at, which fixes what the packer passes it.
 */
export interface Scheduled<At extends keyof Moments> {
  /**
   * Explains what the package needs the hook for, and shows up wherever layers are reported.
   */
  because: string;

  /**
   * Runs when the packer reaches the moment this type names.
   */
  runs: Runs<At>;
}

/**
 * Runs code once, before the packer starts on a package.
 *
 * @remarks
 *   Nothing has been read or written yet, which makes this the place to produce a file the build
 *   itself will go on to read.
 */
export function buildPrepare(stated: Scheduled<"build:prepare">): Override {
  return named(
    "pack.buildPrepare",
    hook({ because: stated.because, hooks: { "build:prepare": stated.runs } }),
  );
}

/**
 * Runs code before each bundle, with the bundler's options in hand.
 *
 * @remarks
 *   A package that publishes two formats gets two calls, one per format. Code that has to happen
 *   exactly once belongs in `build:prepare` instead.
 */
export function buildBefore(stated: Scheduled<"build:before">): Override {
  return named(
    "pack.buildBefore",
    hook({ because: stated.because, hooks: { "build:before": stated.runs } }),
  );
}

/**
 * Runs code after the packer has finished, with every chunk it emitted.
 *
 * @remarks
 *   The output exists on disk by the time this runs, so a step that has to see the finished build —
 *   a size budget, a copy into another package — belongs here rather than at an earlier moment.
 */
export function buildDone(stated: Scheduled<"build:done">): Override {
  return named(
    "pack.buildDone",
    hook({ because: stated.because, hooks: { "build:done": stated.runs } }),
  );
}
