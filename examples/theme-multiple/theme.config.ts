/**
 * States the themes the page can wear and the preset of the application's own recipes. The first
 * theme is the default, and every one of them switches under `data-theme`. Abyss is derived from
 * Fathom, and the compiler composes the lineage. The preset registers the badge, which Abyss
 * extends by its key. The published themes follow the four examples.
 */

import { abyss } from "@stealthscale/example-theme-abyss";
import { fathom } from "@stealthscale/example-theme-fathom";
import { folio } from "@stealthscale/example-theme-folio";
import { forge } from "@stealthscale/example-theme-forge";
import { type Application } from "@stealthscale/theme/authoring";

import { publishedThemes } from "#published-themes.ts";
import own from "#theme.ts";

export default {
  presets: [own],
  themes: [fathom, folio, forge, abyss, ...publishedThemes],
} satisfies Application;
