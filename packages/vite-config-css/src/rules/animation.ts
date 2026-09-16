/**
 * Limits a stylesheet's animations to properties the compositor can run.
 */

/**
 * Refuses an animation of a property the browser cannot run on the compositor.
 *
 * @remarks
 *   Animating anything beyond a transform or an opacity puts layout or paint
 *   on the main thread for every frame, which is what drops an animation below
 *   the display's refresh rate on a mid-range device. The rule reads a
 *   transition as well as a keyframe.
 */
export const ANIMATION = {
  "plugin/no-low-performance-animation-properties": true,
};
