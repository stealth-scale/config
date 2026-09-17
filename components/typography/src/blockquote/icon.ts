/**
 * Draws the mark beside a quotation, which is the library's own icon bound to the icon slot.
 *
 * @remarks
 *   The part binds the icon component rather than an `svg`, so the two recipes compose. The
 *   icon's own recipe says what an icon is and takes its size, and the blockquote's icon slot says
 *   how the mark sits in the whole, its colour in the look the root was given. The artwork is the
 *   caller's, as it is on every icon.
 */

import { type ComponentProps } from "react";

import { withContext } from "#blockquote/context.ts";
import { Icon as Artwork } from "#icon/icon.ts";

/**
 * Draws the mark beside the quotation, in the colour of the look and at the size a caller picks.
 */
export const Icon = withContext(Artwork, "icon");

/**
 * Describes what the mark takes: the icon's variants and everything a styled svg element takes.
 */
export type IconProps = ComponentProps<typeof Icon>;
