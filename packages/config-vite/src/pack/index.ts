/**
 * The `pack` block: what a package publishes, and what is checked before it does.
 */

export { carry } from "#pack/carry.ts";
export { command } from "#pack/command.ts";
export { declarations } from "#pack/declarations.ts";
export { entry } from "#pack/entry.ts";
export { buildBefore, buildDone, buildPrepare, hook, type Hooked } from "#pack/hook.ts";
export { inventory } from "#pack/inventory.ts";
export { platform, type Platform } from "#pack/platform.ts";
export * as preset from "#pack/preset.ts";
export { published } from "#pack/published.ts";
export { quality } from "#pack/quality.ts";
export { type Commands } from "#pack/settings.ts";
export { ships } from "#pack/ships.ts";
export { source } from "#pack/source.ts";
