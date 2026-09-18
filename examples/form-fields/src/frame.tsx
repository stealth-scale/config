/**
 * Draws what every control shares: the label, the help text, the error, and the attributes that
 * tie them to the control for a screen reader.
 */

import { type ReactElement, type ReactNode } from "react";

import { type ControlProps, useFieldAria } from "@stealthscale/provider-form";

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
  readonly children: (control: ControlProps) => ReactNode;
}

/**
 * Draws the frame around one control.
 *
 * @remarks
 *   The foundation resolves the words and the wiring. The label reads the catalogue, then the
 *   words given, then the schema's `title`, then the path written out, and the help text reads
 *   the catalogue and then the schema's `description`. The error is shown once a person has
 *   touched the field or a submit was attempted, and `aria-describedby` names the help text and
 *   the error only while each is on the page.
 */
export function Frame({ children, label, required }: FrameProps): ReactElement {
  const aria = useFieldAria({ label, required });

  return (
    <div className="field">
      <label {...aria.label.props}>{aria.label.text}</label>
      {children(aria.control)}
      {aria.description === undefined ? null : (
        <p {...aria.description.props}>{aria.description.text}</p>
      )}
      {aria.error === undefined ? null : <p {...aria.error.props}>{aria.error.text}</p>}
    </div>
  );
}
