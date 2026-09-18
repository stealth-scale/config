/**
 * Draws what every control shares: the label, the help text, the error, and the attributes that
 * tie them to the control for a screen reader.
 */

import { type ReactElement, type ReactNode, useId } from "react";

import { textOf, useProperty, useWords } from "@stealthscale/provider-form";

import { useBoundField } from "#field-like.ts";

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
   * Whether the schema requires a value.
   */
  readonly "aria-required": boolean;

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
 * Describes what every field component is given.
 */
export interface FieldProps {
  /**
   * The words of the label, where the catalogue has none and the schema's title is wrong.
   */
  readonly label?: string | undefined;

  /**
   * Whether a value is required. Read off the schema where the caller states nothing.
   */
  readonly required?: boolean | undefined;
}

/**
 * Describes what a frame is given.
 */
export interface FrameProps extends FieldProps {
  /**
   * Draws the control, given the attributes that tie it to the label, the help text and the
   * error.
   */
  readonly children: (control: ControlAttributes) => ReactNode;
}

/**
 * Draws the frame around one control.
 *
 * @remarks
 *   The label reads the catalogue, then the words given, then the schema's `title`, then the
 *   path written out. The help text reads the catalogue and then the schema's `description`. The
 *   error is shown once a person has touched the field or a submit was attempted, and the first
 *   error in slot order is the one shown.
 */
export function Frame({ children, label, required }: FrameProps): ReactElement {
  const field = useBoundField<unknown>();
  const property = useProperty();
  const words = useWords();
  const id = useId();
  const { errors, isTouched } = field.state.meta;
  const [error] = errors;
  const shown = isTouched && error !== undefined;
  const { schema } = property;
  const description = words.description(
    field.name,
    schema === undefined ? undefined : textOf(schema, "description"),
  );

  return (
    <div className="field">
      <label htmlFor={id}>
        {words.label(
          field.name,
          label ?? (schema === undefined ? undefined : textOf(schema, "title")),
        )}
      </label>
      {children({
        "aria-describedby": `${id}-help ${id}-error`,
        "aria-invalid": shown,
        "aria-required": required ?? property.required,
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
