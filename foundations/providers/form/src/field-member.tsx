/**
 * Draws one field of a generated form through the renderer that suits it.
 */

import { type ReactElement } from "react";

import { Field } from "@tanstack/react-form";

import { fieldContext, useAnyForm } from "#contexts.ts";
import { defaultsOf } from "#defaults.ts";
import { bound, propertyOf, requiredIn } from "#property.ts";
import { describedForm } from "#registry.ts";
import { rendererFor } from "#renderer.ts";
import { type Schema } from "#schema.ts";

/**
 * Describes what a field of a generated form is given.
 */
export interface FieldMemberProps {
  /**
   * The indices of the items of the repeat groups around the field, outermost first.
   */
  readonly indices: readonly number[];

  /**
   * The field's path, as the presentation names it.
   */
  readonly path: string;

  /**
   * The schema resolved against the values in hand.
   */
  readonly resolved: Schema;
}

/**
 * Draws one field of a generated form, or nothing.
 *
 * @remarks
 *   A member the resolved schema lacks is skipped, which is how a field on a condition is drawn
 *   only where the condition holds. A member no renderer suits is skipped as well. A field the
 *   values have no value for, such as one on a condition the values built from the schema never
 *   met, starts from the property's own default. A field with a value keeps it, because a field's
 *   own default is written over an untouched value when the field mounts. The field options given
 *   for the path are written onto the field as they are.
 */
export function FieldMember({ indices, path, resolved }: FieldMemberProps): null | ReactElement {
  const form = useAnyForm();
  const { engine, fieldOptions, layouts, presentation, renderers } = describedForm(form);
  const schema = propertyOf(resolved, path);
  const setting = presentation.fields?.[path] ?? {};
  const renderer = schema === undefined ? undefined : rendererFor(renderers, setting, schema);

  if (schema === undefined || renderer === undefined) return null;

  const { Cell } = layouts;
  const Draw = renderer.draw;
  const name = bound(path, indices);
  const missing = form.getFieldValue(name) === undefined;
  const options = {
    ...(missing && { defaultValue: defaultsOf(schema, undefined, engine) }),
    ...fieldOptions[path],
  };

  return (
    <Cell span={setting.span}>
      <Field {...options} form={form} name={name}>
        {(field) => (
          <fieldContext.Provider value={field}>
            <Draw presentation={setting} required={requiredIn(resolved, path)} schema={schema} />
          </fieldContext.Provider>
        )}
      </Field>
    </Cell>
  );
}
