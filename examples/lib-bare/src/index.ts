/**
 * A library carrying no build configuration of its own.
 *
 * @remarks
 *   There is no `vite.config.ts` beside this file. The packer takes its
 *   settings from the workspace root and its entry from the argument the
 *   package manifest passes to `vp pack`, so the entry is named in one place
 *   and moving this file means editing that script.
 * @packageDocumentation
 */

export { slug } from "#slug.ts";
