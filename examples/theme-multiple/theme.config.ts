/**
 * States the themes the page can wear. The first is the default, and every one of them switches
 * under `data-theme`. Abyss is derived from Fathom, and the compiler composes the lineage.
 */

import { abyss } from "@stealthscale/example-theme-abyss";
import { fathom } from "@stealthscale/example-theme-fathom";
import { folio } from "@stealthscale/example-theme-folio";
import { forge } from "@stealthscale/example-theme-forge";
import { type Application } from "@stealthscale/theme/authoring";

export default { themes: [fathom, folio, forge, abyss] } satisfies Application;
