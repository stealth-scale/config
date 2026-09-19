/**
 * Carries what a fieldset knows about itself down to its parts and to the fields inside it.
 */

import { createContext, useContext } from "react";

import { type Ids, idsOf } from "#field/ids.ts";

/**
 * Describes what a group's parts and the fields inside it read.
 */
export interface FieldsetState {
  /**
   * Whether every control in the group is out of reach.
   */
  disabled: boolean;

  /**
   * The identifiers the group's own texts are referenced by.
   */
  ids: Ids;

  /**
   * Whether what the group holds is wrong.
   */
  invalid: boolean;
}

/**
 * The state a field reads where no group is above it, which is the common case.
 */
const LOOSE: FieldsetState = { disabled: false, ids: idsOf("fieldset"), invalid: false };

/**
 * Hands the group's state down.
 *
 * @remarks
 *   The context answers rather than throwing, because a field outside a group is ordinary. A
 *   group's own parts are never drawn outside one, so the default they would read is unused.
 */
const FieldsetContext = createContext<FieldsetState>(LOOSE);

/**
 * Hands the group's state to its parts and to the fields inside it.
 */
export const FieldsetProvider = FieldsetContext;

/**
 * Reads the group around a field or a part.
 *
 * @returns The group's state, or nothing disabled where there is no group.
 */
export function useFieldset(): FieldsetState {
  return useContext(FieldsetContext);
}
