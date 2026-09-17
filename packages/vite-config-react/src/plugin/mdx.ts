/**
 * Configures the MDX plugin that compiles a document into a component.
 */

import compiler, { type Options } from "@mdx-js/rollup";

import {
  contribute,
  type Contribution,
  type Layer,
  override,
  type Override,
} from "@stealthscale/vite-config";

import { FACTORY } from "#plugin/refresh.ts";

/**
 * The configuration key the packer reads its plugins from.
 */
const PACKED = "pack.plugins";

/**
 * The one document format the plugin compiles.
 *
 * @remarks
 *   At its default the plugin claims every markdown extension as well, and a `.md` file imported
 *   with `?raw` then arrives as a component rather than as a string.
 */
const FORMAT = "mdx";

/**
 * Narrows the transform a document is compiled under.
 */
export interface Documented {
  /**
   * The package the automatic runtime imports the JSX factory from. A caller that changes it
   * passes the same value to `plugin.refresh`.
   */
  from?: string;
}

/**
 * Fills in what a caller left out and hands the result to the MDX plugin.
 */
export function options(stated: Documented): Options {
  return { format: FORMAT, jsxImportSource: stated.from ?? FACTORY };
}

/**
 * Puts the MDX plugin ahead of every plugin the tree built.
 *
 * @remarks
 *   The React Compiler runs in the same `pre` phase and fails on raw MDX when it runs first. An
 *   override refines the configuration after every contribution has landed, so the plugin is
 *   first whatever order a caller wrote the layers in.
 */
function compiled(stated: Documented): Override {
  const plugin = { enforce: "pre" as const, ...compiler(options(stated)) };

  return override({
    because: "a document has to be a component before anything else can compile it",
    name: "react.plugin.mdx",
    refine: (_context, config) => ({ ...config, plugins: [plugin, ...(config.plugins ?? [])] }),
  });
}

/**
 * Adds the MDX plugin to the plugins the packer runs.
 *
 * @remarks
 *   The packer reads `pack.plugins` and nothing under `plugins`, so a library that publishes a
 *   document needs the plugin stated a second time.
 */
function packed(stated: Documented): Contribution {
  return contribute({
    at: PACKED,
    because: "the packer reads its own plugin list, and a document has to compile there too",
    item: compiler(options(stated)),
    name: "react.plugin.mdx(pack)",
  });
}

/**
 * Compiles `.mdx` files into components, in the build and in the packer.
 *
 * @remarks
 *   Both plugin instances are constructed when this call runs, not when the configuration
 *   resolves, so two calls produce two independent pairs.
 * @param stated - The parts of the transform to change. Omitting it compiles a document rendering
 *   through React itself.
 */
export function mdx(stated: Documented = {}): readonly Layer[] {
  return [compiled(stated), packed(stated)];
}
