/**
 * Draws a group of a generated form: a fieldset where it has a legend, a disclosure where it
 * starts closed, and a layout alone where it has neither.
 */

import { type ReactElement } from "react";

import { type GroupProps, useWords } from "@stealthscale/provider-form";

/**
 * Draws a group of fields.
 *
 * @remarks
 *   A group with columns is a grid, a group with the row direction is a row, and any other group
 *   is a column. A repeat group is handed `onAdd`, and the button reads `<id>.actions.add`.
 */
export function Group({
  children,
  closed,
  columns,
  direction,
  legend,
  onAdd,
}: GroupProps): ReactElement {
  const words = useWords();
  const layout = columns === undefined ? (direction ?? "column") : `grid columns-${columns}`;
  const inner = (
    <>
      <div className={layout}>{children}</div>
      {onAdd === undefined ? null : (
        <button onClick={onAdd} type="button">
          {words.action("add", "Add")}
        </button>
      )}
    </>
  );

  if (legend === undefined) return inner;

  if (closed === true) {
    return (
      <details>
        <summary>{legend}</summary>
        {inner}
      </details>
    );
  }

  return (
    <fieldset>
      <legend>{legend}</legend>
      {inner}
    </fieldset>
  );
}
