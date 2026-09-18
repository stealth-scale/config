/**
 * Draws one control bound to the field its schema's type asks for, for the specifications of the
 * controls.
 */

import { type ComponentType, type ReactElement } from "react";

import { useAppForm } from "@stealthscale/example-form-fields";
import { type Field, type RendererProps, type Schema } from "@stealthscale/provider-form";

/**
 * Describes what the harness is given.
 */
export interface HarnessProps {
  /**
   * The control under test.
   */
  readonly draw: ComponentType<RendererProps>;

  /**
   * How the field is drawn.
   */
  readonly presentation?: Field | undefined;

  /**
   * The property's schema.
   */
  readonly schema: Schema;
}

/**
 * How a field is drawn where a specification states nothing.
 */
const PLAIN: Field = {};

/**
 * Draws the control over a form with a number, a choice and a note, bound by the schema's type.
 */
export function Harness({ draw: Draw, presentation = PLAIN, schema }: HarnessProps): ReactElement {
  const form = useAppForm({ defaultValues: { amount: 2, note: "", pick: "" } });
  const name =
    schema["type"] === "number" ? "amount" : Array.isArray(schema["enum"]) ? "pick" : "note";

  return (
    <form.AppForm>
      <form.AppField name={name}>
        {() => <Draw presentation={presentation} required={false} schema={schema} />}
      </form.AppField>
    </form.AppForm>
  );
}
