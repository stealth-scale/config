/**
 * Extends the card for a console: every header set in capitals, and an elevated card lifted
 * further from the page.
 *
 * @remarks
 *   A console scans a wall of cards by their headers, and a capital header holds its width when
 *   the text changes. Nothing here names a class or a slot, because both are the component's to
 *   name. The extension is keyed by slot, as the recipe it extends is. The header's tracking is
 *   left alone, because the size variant sets a text style on the header, and the compiler places
 *   a variant's rule after an extension of the base.
 */

import { type SlotRecipeExtension } from "@stealthscale/theme/authoring";

/**
 * Sets every card's header in capitals, and lifts an elevated card to the extra large shadow.
 */
export const extension: SlotRecipeExtension = {
  base: { header: { textTransform: "uppercase" } },
  variants: { variant: { elevated: { root: { boxShadow: "xl" } } } },
};
