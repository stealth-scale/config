/**
 * Draws one item of a repeat group with the control that removes it.
 */

import { type ReactElement } from "react";

import { type ItemProps, useWords } from "@stealthscale/provider-form";

/**
 * Draws the item's members and a button that removes the item, reading `<id>.actions.remove`.
 */
export function Item({ children, index, onRemove }: ItemProps): ReactElement {
  const words = useWords();

  return (
    <div className="item" data-index={index}>
      {children}
      <button onClick={onRemove} type="button">
        {words.action("remove", "Remove")}
      </button>
    </div>
  );
}
