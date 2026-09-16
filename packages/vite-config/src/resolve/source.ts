/**
 * Points both of Vite's resolvers at a workspace package's source.
 */

import { defaultClientConditions, defaultServerConditions } from "vite";

import { type Preset, preset } from "@stealthscale/vite-config-core";

import { SOURCE } from "#resolve/condition.ts";

/**
 * Resolves a workspace import to source by placing the source condition ahead
 * of the defaults.
 *
 * @remarks
 *   The browser and the node resolvers are given separate lists, because Vite's
 *   own defaults differ between the two and each has to keep its own below the
 *   source condition. A dependency from outside this workspace declares no such
 *   condition and resolves exactly as it would have.
 */
export function source(): Preset {
  return preset({
    config: {
      resolve: { conditions: [SOURCE, ...defaultClientConditions] },
      ssr: { resolve: { conditions: [SOURCE, ...defaultServerConditions] } },
    },
    name: `resolve.source(${SOURCE})`,
  });
}
