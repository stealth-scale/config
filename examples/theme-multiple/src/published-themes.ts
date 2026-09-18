/**
 * Lists the eight published themes with the variants derived from them, in the order the page
 * offers them after the four example themes.
 */

import { asphalt } from "@stealthscale/theme-asphalt";
import { compass, compassContrast } from "@stealthscale/theme-compass";
import { graphite, graphiteContrast, graphiteDimmed } from "@stealthscale/theme-graphite";
import { lantern } from "@stealthscale/theme-lantern";
import { pebble } from "@stealthscale/theme-pebble";
import { prism } from "@stealthscale/theme-prism";
import { quartz } from "@stealthscale/theme-quartz";
import { steel, steelGray } from "@stealthscale/theme-steel";
import { type Theme } from "@stealthscale/theme/authoring";

/**
 * Lists the published themes, each root followed by the variants derived from it.
 */
export const publishedThemes: readonly Theme[] = [
  graphite,
  graphiteDimmed,
  graphiteContrast,
  steel,
  steelGray,
  compass,
  compassContrast,
  quartz,
  asphalt,
  pebble,
  lantern,
  prism,
];
