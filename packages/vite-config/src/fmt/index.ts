/**
 * The `fmt` block: the one shape every package is written in.
 *
 * Stated once, at the workspace root. A package's own config carries what Vite, Vitest and its
 * framework need, and the formatter reads none of them — a layer from this block put in one is
 * composed, merged and then never seen. Where a package needs an answer of its own, the glob says
 * which files it reaches rather than which config states it.
 */

export { docblocks } from "#fmt/docblock.ts";
export { imports } from "#fmt/imports.ts";
export { manifests } from "#fmt/manifests.ts";
export { generated, group, type Grouped, internal, skip, type Skipped } from "#fmt/override.ts";
export { prose } from "#fmt/prose.ts";
export { style } from "#fmt/style.ts";
