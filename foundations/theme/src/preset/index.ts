/**
 * Assembles the foundation: the vocabulary every recipe in a workspace is written against.
 *
 * @remarks
 *   The foundation holds no recipe. A recipe belongs beside the component it draws, and a value
 *   belongs here, so a theme moves the value without knowing which components read it. The
 *   compiler's base preset is not named here: the build plugin installs it beneath the foundation
 *   by absolute path, so this package depends on no compiler package but the types.
 */

import { definePreset, type Preset } from "#authoring/preset.ts";
import { breakpoints } from "#preset/breakpoints.ts";
import { conditions } from "#preset/conditions.ts";
import { containers } from "#preset/containers.ts";
import { globalCss } from "#preset/global-css.ts";
import { keyframes } from "#preset/keyframes.ts";
import { semanticTokens } from "#preset/semantic-tokens/index.ts";
import { animationStyles, layerStyles, textStyles } from "#preset/styles/index.ts";
import { tokens } from "#preset/tokens/index.ts";
import { utilities } from "#preset/utilities.ts";

/**
 * Fixes the name the compiler reports the foundation by, which is the package that publishes it.
 */
const NAME = "@stealthscale/theme";

/**
 * Lists the foundation as the preset an application's compiler installs.
 *
 * @remarks
 *   Every section is under `extend`. Without it a preset replaces the section it names rather
 *   than adding to it, which would drop everything the compiler's base preset states.
 */
export const foundation: Preset = definePreset({
  conditions,
  globalCss,
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
