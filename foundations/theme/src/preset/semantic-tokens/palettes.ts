/**
 * Defines the palettes: twelve roles on every hue ramp, and eight semantic palettes that fill the
 * same roles by reference to a hue.
 *
 * @remarks
 *   A recipe names an intent, `primary` or `error`, and a theme decides the hue by pointing the
 *   palette at another ramp. The foundation points each semantic palette where `palettes()` points
 *   it when nothing is named, so a theme that names nothing gets the same map.
 */

import { palettes as filled, type Palettes } from "#scales/palettes.ts";

/**
 * Lists every palette: the eleven hue palettes, then the eight semantic ones.
 */
export const palettes: Palettes = filled();
