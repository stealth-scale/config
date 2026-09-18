/**
 * States every theme the catalogue can wear.
 *
 * @remarks
 *   All twelve, each root followed by the variants derived from it. A catalogue is where a theme is
 *   judged against the components it moves, so it carries the whole set rather than a default.
 *   Graphite is first, which makes it the theme a page wears until somebody switches.
 *   `static` is `*` because a scene picks its variants while it runs. The compiler extracts a value
 *   written as a JSX literal and nothing it reads from a prop, so a matrix drawing `variant={one}`
 *   emits no rule for any value it draws. A product application states nothing here and ships only
 *   the rules its own source asks for.
 */

import { asphalt } from "@stealthscale/theme-asphalt";
import { compass, compassContrast } from "@stealthscale/theme-compass";
import { graphite, graphiteContrast, graphiteDimmed } from "@stealthscale/theme-graphite";
import { lantern } from "@stealthscale/theme-lantern";
import { pebble } from "@stealthscale/theme-pebble";
import { prism } from "@stealthscale/theme-prism";
import { quartz } from "@stealthscale/theme-quartz";
import { steel, steelGray } from "@stealthscale/theme-steel";
import { type Application } from "@stealthscale/theme/authoring";

export default {
  static: "*",
  themes: [
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
  ],
} satisfies Application;
