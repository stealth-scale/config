/**
 * Reads the schema of the property a bound field component is drawing.
 */

import { useFieldContext } from "#contexts.ts";
import { collapse } from "#path.ts";
import { propertyOf, requiredIn } from "#property.ts";
import { descriptionOf } from "#registry.ts";
import { type Schema } from "#schema.ts";

/**
 * Describes the property a field is bound to.
 */
export interface Property {
  /**
   * Whether the schema requires the property.
   */
  readonly required: boolean;

  /**
   * The property's schema, or nothing where the form was not built from a schema or the schema
   * has no property at the field's path.
   */
  readonly schema: Schema | undefined;
}

/**
 * The property of a field whose form was not built from a schema.
 */
const NONE: Property = { required: false, schema: undefined };

/**
 * Reads the property the field in scope is bound to.
 *
 * @remarks
 *   The property is read off the full schema, so a field component draws a select's choices, a
 *   text box's kind and a label's development text without being told them. Whether a
 *   conditional branch requires the property is read off the resolved schema by the component
 *   that draws a generated form, and handed to the field component as a prop.
 */
export function useProperty(): Property {
  const field = useFieldContext();
  const description = descriptionOf(field.form);

  if (description === undefined) return NONE;

  const path = collapse(field.name);

  return {
    required: requiredIn(description.schema, path),
    schema: propertyOf(description.schema, path),
  };
}
