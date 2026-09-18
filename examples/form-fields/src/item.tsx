/**
 * Draws one item of a repeat group with the control that removes it.
 */

import { type ReactElement } from "react";

import { type ItemProps, useWords } from "@stealthscale/provider-form";

/**
 * Draws the item's members and a button that removes the item, reading `<id>.actions.remove`.
 *
 * @remarks
 *   The button is left out where the foundation gives no way to remove, which it does while the
 *   array holds no more items than its schema requires. The root element carries the id the
 *   foundation gives it, which is how focus moves into an item once one is added or removed.
 */
export function Item({ children, id, index, onRemove }: ItemProps): ReactElement {
  const words = useWords();

  return (
    <div className="item" data-index={index} id={id}>
      {children}
      {onRemove === undefined ? null : (
        <button onClick={onRemove} type="button">
          {words.action("remove", "Remove")}
        </button>
      )}
    </div>
  );
}
