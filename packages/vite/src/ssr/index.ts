/**
 * The `ssr` block: what a build meant for a server does differently.
 *
 * Read from the package's own config. Only an application that renders before it reaches a browser
 * has a server build at all, and what that build leaves to its runtime is a fact about the
 * application rather than about the workspace.
 *
 * Nothing here states `ssr.external`. Naming what to leave out is the same decision as naming what
 * to bundle, made from the other side and needing the whole list rather than the exceptions, so a
 * repository that states it has to keep it in step with its own dependencies.
 */

export { bundled, type Bundled } from "#ssr/bundled.ts";
export { runtime } from "#ssr/runtime.ts";
