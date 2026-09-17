/**
 * States the one theme the page wears. It is the default, so the page writes no theme attribute.
 */

import { fathom } from "@stealthscale/example-theme-fathom";
import { type Application } from "@stealthscale/theme/authoring";

export default { themes: [fathom] } satisfies Application;
