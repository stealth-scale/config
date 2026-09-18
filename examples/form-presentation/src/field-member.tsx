/**
 * Draws one field of the presentation through the renderer that suits it.
 */

import { type ReactElement } from "react";

import { withForm } from "@stealthscale/example-form-fields";
import { defaultsOf, rendererFor } from "@stealthscale/provider-form";

import { checkoutOptions } from "#options.ts";
import { bound, OUTSIDE, propertyOf, requiredIn } from "#paths.ts";
import { renderers } from "#renderers.ts";
import { checkout, presentation } from "#schema.ts";

/**
 * Draws one field over the form handed to it.
 *
 * @remarks
 *   A member the resolved schema lacks is skipped, which is how a field on a condition is drawn
 *   only where the condition holds. A member no renderer suits is skipped as well. A field the
 *   values have no value for, such as one on a condition the values built from the schema never
 *   met, starts from the property's own default. A field with a value keeps it, because a field's
 *   own default is written over an untouched value when the field mounts.
 */
export const FieldMember = withForm({
  ...checkoutOptions,
  props: { index: OUTSIDE, path: "", resolved: checkout, shape: presentation },
  /**
   * Draws the field, or nothing.
   */
  render: function FieldMember({ form, index, path, resolved, shape }): null | ReactElement {
    const schema = propertyOf(resolved, path);
    const setting = shape.fields?.[path] ?? {};
    const renderer = schema === undefined ? undefined : rendererFor(renderers, setting, schema);

    if (schema === undefined || renderer === undefined) return null;

    const Draw = renderer.draw;
    const name = bound(path, index);
    const missing = form.getFieldValue(name) === undefined;

    return (
      <div className={setting.span === undefined ? undefined : `span-${setting.span}`}>
        <form.AppField defaultValue={missing ? defaultsOf(schema) : undefined} name={name}>
          {() => (
            <Draw presentation={setting} required={requiredIn(resolved, path)} schema={schema} />
          )}
        </form.AppField>
      </div>
    );
  },
});
