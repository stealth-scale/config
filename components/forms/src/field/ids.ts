/**
 * Builds the identifiers a field's parts reference each other by.
 */

/**
 * Describes the four elements a field wires together.
 */
export interface Ids {
  /**
   * The control a person fills in.
   */
  control: string;

  /**
   * The text shown where the field is wrong.
   */
  errorText: string;

  /**
   * The text shown beside the field whatever its state.
   */
  helperText: string;

  /**
   * The words naming the field.
   */
  label: string;
}

/**
 * Builds the four from one identifier.
 *
 * @remarks
 *   The control's own identifier is the one a caller may state, because a label written outside
 *   the field points at it with `htmlFor`. The other three are derived, so nothing outside the
 *   field needs to know them.
 * @param id - The field's identifier, which a caller states or React generates.
 * @returns One identifier per element.
 */
export function idsOf(id: string): Ids {
  return {
    control: id,
    errorText: `${id}-error`,
    helperText: `${id}-helper`,
    label: `${id}-label`,
  };
}

/**
 * Lists the text a control is described by, in the order a screen reader reads it.
 *
 * @remarks
 *   Both are listed whether or not either is drawn. An identifier naming no element is passed over
 *   by every screen reader, so listing both costs nothing and saves the field from watching the
 *   document to find out which of them exists. Watching would mean writing state from an effect,
 *   which React 19 reports, and a second render before the control is described at all.
 * @param ids - The field's identifiers.
 * @returns The value of `aria-describedby`.
 */
export function describedBy(ids: Ids): string {
  return `${ids.helperText} ${ids.errorText}`;
}
