/**
 * The plugin that compiles JSX and reloads a component without losing what it was holding.
 */

import react, { type Options } from "@vitejs/plugin-react";

import { contribute, type Contribution } from "@stealthscale/config-vite";

/**
 * Where a contribution to the list of plugins lands.
 */
const AT = "plugins";

/**
 * The files the plugin compiles before anything is added to them.
 *
 * Markdown that renders is included because it becomes JSX before it reaches here, and a transform
 * that skipped it would leave the one file kind whose whole point is rendering uncompiled. It needs
 * a plugin ahead of this one to do that conversion; without one, the first such file fails rather
 * than silently shipping unrendered.
 */
const COMPILED = [/\.[tj]sx?$/u, /\.mdx$/u];

/**
 * The files it leaves alone before anything is added to them.
 *
 * Kept first wherever more are added, because a dependency compiled a second time is the one
 * exclusion nobody means to drop.
 */
const UNTOUCHED = /\/node_modules\//u;

/**
 * The runtime the JSX factory is imported from, exported so a specification can hold the tsconfig
 * to the same answer.
 *
 * Not an argument on its own: this is the same string the tsconfig this package ships puts in
 * `jsxImportSource`, and the two have to agree or a file compiles against one factory and
 * type-checks against another. A repository changing it changes both, which is what `from` is for.
 */
export const FACTORY = "react";

/**
 * Describes what a repository knows about its own files that this package cannot.
 */
export interface Refreshed {
  /**
   * The files to compile beyond the TypeScript and JavaScript ones.
   *
   * Added to the default rather than replacing it, so asking for `.mdx` does not quietly stop
   * `.tsx` being compiled.
   */
  also?: readonly RegExp[];

  /**
   * Auto-memoises with the React Compiler.
   *
   * On, which is not the plugin's own default. The compiler decides what a component recomputes,
   * and a build with it is a different program from one without — so the house builds one of them
   * and tests that one, rather than shipping the memoised build and testing the other.
   *
   * Turned off for a package the compiler cannot reason about: it refuses a component that breaks
   * the rules of React rather than compiling it wrongly, and a package with such a component says
   * so here while it is being fixed.
   */
  compiler?: boolean;

  /**
   * The files to leave alone beyond the dependencies.
   *
   * A worker, or JSX belonging to another framework. Added to the default, which keeps a dependency
   * from being compiled twice.
   */
  except?: readonly RegExp[];

  /**
   * Where the JSX factory is imported from, for a repository that renders through something else.
   *
   * The tsconfig has to say the same thing in `jsxImportSource`. Nothing here can check a
   * repository's tsconfig, so the two are stated together or not at all.
   */
  from?: string;
}

/**
 * Works out what to hand the plugin.
 *
 * Kept apart from building the plugin so that what a repository asked for can be read back and
 * checked. Every list starts from the answer the plugin would have reached on its own, because both
 * of them replace rather than extend: asking for one more file to compile would otherwise stop the
 * rest being compiled.
 *
 * @param stated - The repository's own answers about its files.
 * @returns The options, as the plugin takes them.
 */
export function options(stated: Refreshed): Options {
  return {
    compiler: stated.compiler ?? true,
    exclude: [UNTOUCHED, ...(stated.except ?? [])],
    include: [...COMPILED, ...(stated.also ?? [])],
    jsxImportSource: stated.from ?? FACTORY,
    jsxRuntime: "automatic",
  };
}

/**
 * Compiles JSX, and reloads a component in place while it is being worked on.
 *
 * Contributed rather than set, because a repository's plugins are a list several modules add to and
 * setting the key would take away whatever the others put there. It arrives in the order it was
 * written, which is the order the plugins run in.
 *
 * The transform is Oxc's, the same compiler the linter and the formatter use, so a file is parsed
 * by one thing rather than three. The React Compiler is on, so what a component recomputes is
 * decided by the compiler rather than by hand. The runtime is the automatic one and is not an
 * argument: the tsconfig this package ships compiles against it, and the rule asking for `React` in
 * scope is turned off on the strength of it. Three things agree, and a repository wanting the
 * classic runtime is changing all three rather than passing an option.
 *
 * @param stated - The repository's own answers about its files. `Refreshed` documents every member.
 * @returns The contribution the bundler runs the plugin from.
 */
export function refresh(stated: Refreshed = {}): Contribution {
  return contribute({
    at: AT,
    because: "a package that renders has to compile JSX before anything can run it",
    item: react(options(stated)),
    name: "react.refresh",
  });
}
