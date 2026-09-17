/**
 * Publishes the preset that registers every recipe written in this application, for the statement
 * to install.
 *
 * @remarks
 *   The same file a component package publishes under `./theme`, kept in the same place and
 *   checked by the same specification, so a recipe in an application and a recipe in a package are
 *   registered alike. The statement in `theme.config.ts` installs it after every package's preset.
 */

import { definePreset } from "@stealthscale/theme/authoring";

import { recipe as badge } from "#badge/badge.recipe.ts";

export default definePreset({
  name: "@stealthscale/example-theme-multiple",
  theme: { extend: { recipes: { badge } } },
});
