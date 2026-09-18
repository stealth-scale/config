/**
 * Carries what a field knows about itself down to its parts.
 */

import { createRequiredContext } from "@stealthscale/hooks";

import { type Ids } from "#field/ids.ts";

/**
 * Describes what every part of a field reads.
 */
export interface FieldState {
  /**
   * Whether a person can reach the control at all.
   */
  disabled: boolean;

  /**
   * The identifiers the parts reference each other by.
   */
  ids: Ids;

  /**
   * Whether what the control holds is wrong.
   */
  invalid: boolean;

  /**
   * Whether the control shows a value a person cannot change.
   */
  readOnly: boolean;

  /**
   * Whether the field has to be filled in.
   */
  required: boolean;
}

/**
 * Hands the field's state to every part, and reads it back.
 *
 * @remarks
 *   A part reads the throwing hook, because a part outside its field is a mistake. A control that
 *   stands on its own and is also composable into a field reads the optional one, so it takes the
 *   field's state where there is one and works where there is not.
 */
export const [FieldProvider, useField, useOptionalField] =
  createRequiredContext<FieldState>("Field");
