/**
 * Bending what this package decided, where a repository knows better than the house.
 */

import { type Layer, layout, remove } from "@stealthscale/vite-config";

import { PAGE } from "#preset/page.ts";

/**
 * Roots the application somewhere other than where the house keeps its page.
 *
 * Two layers rather than one: the house's is taken back by name and the repository's put in its
 * place. Stating the directory alone would not do, because the root decides where the output is
 * written, where static files are read from and where the test runner looks — and those follow from
 * the directory rather than being stated beside it.
 *
 * @param at - The directory holding the page, relative to the package.
 * @returns The removal and what replaces it, in that order.
 */
export function page(at: string): readonly Layer[] {
  return [
    remove({
      because: `this package keeps its page in ${at} rather than in ${PAGE}`,
      name: `react/page(${at})`,
      target: `react/layout.page(${PAGE})`,
    }),
    layout.page(at),
  ];
}
