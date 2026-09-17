/**
 * Publishes the scales a theme is written with: the ramps, the families, the palettes, the
 * corners, the shadows, the geometry, the motion and the type.
 */

export {
  alphaScale,
  backgrounds,
  borders,
  colorScale,
  foregrounds,
  neutralFills,
  oklch,
  type PageLightness,
  paletteAlias,
  paletteRoles,
} from "#scales/color.ts";
export { radii, shadows } from "#scales/depth.ts";
export { controls, gaps, icons, insets, type Scale } from "#scales/geometry.ts";
export { slides } from "#scales/motion.ts";
export {
  families,
  type Families,
  type PaletteAliases,
  palettes,
  type Palettes,
} from "#scales/palettes.ts";
export { fontSizes, typography } from "#scales/type.ts";
