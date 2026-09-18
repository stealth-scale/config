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
 *   array holds no more items than its schema requires.
 */
export function Item({ children, index, onRemove }: ItemProps): ReactElement {
  const words = useWords();

  return (
    <div className="item" data-index={index}>
      {children}
      {onRemove === undefined ? null : (
        <button onClick={onRemove} type="button">
          {words.action("remove", "Remove")}
        </button>
      )}
    </div>
  );
}
