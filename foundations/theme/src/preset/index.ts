/**
 * Assembles the foundation: one preset that fills every category the compiler reads, over the
 * compiler's base preset.
 *
 * @remarks
 *   The base preset is named as a string rather than imported, so the foundation is data the
 *   build plugin can write into a compiler configuration, and the application that runs the
 *   compiler resolves the name. The foundation holds no recipe. A recipe belongs beside the
 *   component it draws.
 */

import { definePreset, type Preset } from "#authoring/preset.ts";
import { breakpoints } from "#preset/breakpoints.ts";
import { conditions } from "#preset/conditions.ts";
import { containers } from "#preset/containers.ts";
import { globalCss } from "#preset/global-css.ts";
import { globalVars } from "#preset/global-vars.ts";
import { keyframes } from "#preset/keyframes.ts";
import { semanticTokens } from "#preset/semantic-tokens/index.ts";
import { animationStyles, layerStyles, textStyles } from "#preset/styles/index.ts";
import { tokens } from "#preset/tokens/index.ts";
import { utilities } from "#preset/utilities.ts";

/**
 * Fixes the name the compiler reports the foundation's diagnostics under.
 */
const NAME = "@stealthscale/theme";

/**
 * Fills every category the compiler reads.
 */
export const foundation: Preset = definePreset({
  conditions,
  globalCss,
  globalVars,
  name: NAME,
  theme: {
    extend: {
      animationStyles,
      breakpoints,
      containers,
      keyframes,
      layerStyles,
      semanticTokens,
      textStyles,
      tokens,
    },
  },
  utilities,
});
