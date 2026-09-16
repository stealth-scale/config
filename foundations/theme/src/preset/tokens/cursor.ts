/**
 * Defines the cursor each kind of control is drawn with.
 *
 * @remarks
 *   A recipe writes `cursor: "button"` rather than `pointer`, so a theme that wants native
 *   controls drawn with the arrow, as a desktop application does, changes one token rather than
 *   every recipe. The defaults follow the web: a button and a switch take the hand, and a form
 *   control keeps the arrow.
 */

import { type Tokens } from "#pandacss.ts";

/**
 * Describes the cursors a theme states.
 */
type Cursors = NonNullable<Tokens["cursor"]>;

/**
 * Lists the cursors, one per kind of control.
 */
export const cursor: Cursors = {
  button: { value: "pointer" },
  checkbox: { value: "default" },
  disabled: { value: "not-allowed" },
  menuitem: { value: "default" },
  option: { value: "default" },
  radio: { value: "default" },
  slider: { value: "default" },
  switch: { value: "pointer" },
};
