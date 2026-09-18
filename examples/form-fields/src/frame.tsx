/**
 * Draws what every control shares: the label, the help text, the error, and the attributes that
 * tie them to the control for a screen reader.
 */

import { type ReactElement, type ReactNode, useId } from "react";

import { useBoundField } from "#field-like.ts";
import { useWords } from "#words.ts";

/**
 * Describes the attributes a frame hands the control it wraps.
 */
export interface ControlAttributes {
  /**
   * The ids of the help text and the error, so a screen reader reads both with the control.
   */
  readonly "aria-describedby": string;

  /**
   * Whether the control shows an error.
   */
  readonly "aria-invalid": boolean;

  /**
   * The id the label points at.
   */
  readonly id: string;

  /**
   * The field's path, written as the control's name so a refused submit can find it.
   */
  readonly name: string;
}

/**
 * Describes what a frame is given.
 */
export interface FrameProps {
  /**
   * Draws the control, given the attributes that tie it to the label, the help text and the
   * error.
   */
  readonly children: (control: ControlAttributes) => ReactNode;

  /**
   * The words of the label, where the catalogue has none and the path written out is wrong.
   */
  readonly label?: string | undefined;
}

/**
 * Draws the frame around one control.
 *
 * @remarks
 *   The error is shown once a person has touched the field or a submit was attempted, and the
 *   first error in slot order is the one shown. The help text is drawn where the catalogue has an
 *   entry for the field.
 */
export function Frame({ children, label }: FrameProps): ReactElement {
  const field = useBoundField<unknown>();
  const words = useWords();
  const id = useId();
  const { errors, isTouched } = field.state.meta;
  const [error] = errors;
  const shown = isTouched && error !== undefined;
  const description = words.description(field.name);

  return (
    <div className="field">
      <label htmlFor={id}>{words.label(field.name, label)}</label>
      {children({
        "aria-describedby": `${id}-help ${id}-error`,
        "aria-invalid": shown,
        id,
        name: field.name,
      })}
      {description === "" ? null : <p id={`${id}-help`}>{description}</p>}
      {shown ? (
        <p id={`${id}-error`} role="alert">
          {words.error(field.name, error)}
        </p>
      ) : null}
    </div>
  );
}
