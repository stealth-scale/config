/**
 * Draws the region the form's own errors are read from.
 */

import { type ReactElement } from "react";

import { useAnyForm } from "#contexts.ts";
import { errorsId } from "#focus.ts";
import { useDescribedForm } from "#registry.ts";
import { useRootErrors } from "#use-root-errors.ts";
import { useWords } from "#words.ts";

/**
 * Draws the region the form's own errors are read from, through the package's `Errors` layout.
 *
 * @remarks
 *   Drawn on every render, empty until an issue at the root of the schema or a form validator
 *   refuses the whole value, so the region is on the page before its words change and a screen
 *   reader announces them. Its id is derived from the form's, which is how a refused submit that
 *   no field accounts for finds it. Two errors resolving to the same words are read once.
 */
export function RootErrors(): ReactElement {
  const form = useAnyForm();
  const { layouts } = useDescribedForm(form);
  const errors = useRootErrors();
  const words = useWords();
  const { Errors } = layouts;
  const resolved = [...new Set(errors.map((error) => words.error("", error)))];

  return <Errors errors={resolved} id={errorsId(form.formId)} />;
}
