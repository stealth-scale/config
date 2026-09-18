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
 */
export const [FieldProvider, useField] = createRequiredContext<FieldState>("Field");
