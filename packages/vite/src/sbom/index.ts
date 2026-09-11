/**
 * What a build says it is made of.
 *
 * Not a block of the config: nothing here is a key Vite reads. It is the one description of a bill
 * of materials that both blocks writing one share — `build` for an application it deploys, `pack`
 * for a library it publishes — so that the two differ in what they are describing and in nothing
 * else.
 *
 * Stated in the kernel and re-exported here. The kernel packs before this package and cannot reach
 * it, so a bill of materials for the kernel's own tarball would otherwise be a second copy of these
 * settings kept true by hand.
 *
 * A build prints `Cannot find module 'rollup'` and `Cannot find module 'rolldown'`, three lines of
 * it per package. The plugin is looking for the tools that produced the output so it can record
 * which ones did, and neither is installed under its own name here: Vite+ carries its bundler
 * inside itself. The line is a failed lookup rather than a failed build, and what it was looking
 * for is recorded anyway by another route — every bill of materials this writes names both the
 * plugin and the bundler under `metadata.tools`.
 */

export {
  type Contact,
  HOUSE,
  type Inventory,
  inventory,
  type Kind,
  type Supplier,
} from "@stealthscale/config-core";
