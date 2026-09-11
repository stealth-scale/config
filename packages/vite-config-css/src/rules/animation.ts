/**
 * What a stylesheet may animate without making the browser redo its work.
 */

/**
 * The refusal that keeps an animation off the main thread.
 *
 * A browser can animate `transform` and `opacity` on the compositor, without touching layout or
 * paint. Animating anything else — a width, a margin, a colour — makes it recalculate on every
 * frame, which is where a smooth animation on a developer's machine becomes a stuttering one on a
 * phone.
 *
 * Not Google's, and not fixable by a tool: the fix is a different animation, which only the author
 * can write. It is here because it is the one class of CSS fault that costs something at run time
 * and says nothing at build time.
 */
export const ANIMATION = {
  "plugin/no-low-performance-animation-properties": true,
};
