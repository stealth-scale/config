/**
 * Defines the three faces a page is set in.
 *
 * @remarks
 *   The system stacks, because a face already on the machine is the fastest one there is. A
 *   theme that wants a face of its own states one here and depends on the package that carries
 *   it. The heading face is the body face until a theme says otherwise, so a heading role names
 *   `heading` and a theme sets a display face once.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the faces a theme states.
 */
type Fonts = NonNullable<Tokens["fonts"]>;

/**
 * Fixes the system sans-serif stack, with the emoji faces at the end.
 */
const SANS =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"';

/**
 * Fixes the system monospaced stack.
 */
const MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

/**
 * Lists the faces: the body, the headings, and code.
 */
export const fonts: Fonts = {
  body: { value: SANS },
  heading: { value: SANS },
  mono: { value: MONO },
};
