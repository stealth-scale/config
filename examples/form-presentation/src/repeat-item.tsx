/**
 * Draws one item of a repeat group with the control that removes it.
 */

import { type ReactElement, type ReactNode } from "react";

/**
 * Describes what an item of a repeat group is given.
 */
export interface RepeatItemProps {
  /**
   * The item's members, drawn.
   */
  readonly children: ReactNode;

  /**
   * Removes the item.
   */
  readonly onRemove: () => void;
}

/**
 * Draws the item's members and a button that removes the item.
 */
export function RepeatItem({ children, onRemove }: RepeatItemProps): ReactElement {
  return (
    <div className="item">
      {children}
      <button onClick={onRemove} type="button">
        Remove
      </button>
    </div>
  );
}
