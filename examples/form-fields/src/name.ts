/**
 * Carries the identifier of the form being drawn, which every message identifier of the form
 * begins with.
 */

import { createContext, useContext } from "react";

/**
 * The identifier a form reads its words under where nobody named it.
 */
const UNNAMED = "form";

/**
 * Carries the identifier of the form being drawn. A page sets it once around a form, and every
 * field below reads its label, its help text and its errors under it.
 */
export const FormNameContext = createContext(UNNAMED);

/**
 * Reads the identifier of the form being drawn, or `form` where nobody named it.
 */
export function useFormName(): string {
  return useContext(FormNameContext);
}
