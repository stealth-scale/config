/**
 * Binds a component package's components to the form foundation, which is the one call a package
 * makes, and builds the hook that makes a form from a schema with them.
 */

import { createFormHook } from "@tanstack/react-form";

import { fieldContext, formContext } from "#contexts.ts";
import { type Drawing, useDescription } from "#described.ts";
import { Fields } from "#fields.tsx";
import { schemaFormOptions } from "#form-options.ts";
import { type Layouts } from "#layouts.ts";
import { describeForm } from "#registry.ts";
import { type Renderer } from "#renderer.ts";
import { type Components, type SchemaForm, type UseSchemaFormOptions } from "#schema-form.ts";
import { useDraft } from "#use-draft.ts";

/**
 * Describes what a component package binds: its field components, its form components, its
 * layouts and its renderers.
 *
 * @typeParam FieldComponents - The field components, which `AppField` hands each field.
 * @typeParam FormComponents - The form components, which every form carries.
 */
export interface SchemaFormComponents<
  FieldComponents extends Components,
  FormComponents extends Components,
> {
  /**
   * The components that draw one field each, bound to the field in scope.
   */
  readonly fieldComponents: FieldComponents;

  /**
   * The components that draw around the fields, bound to the form in scope.
   */
  readonly formComponents: FormComponents;

  /**
   * The components that lay a generated form out.
   */
  readonly layouts: Layouts;

  /**
   * The renderers the package draws fields with, before the provider's. None where this is
   * absent.
   */
  readonly renderers?: readonly Renderer[] | undefined;
}

/**
 * Describes the form components every form built here carries beside the package's own.
 */
export interface Generated {
  /**
   * Draws the fields of a form built from a schema.
   */
  readonly Fields: typeof Fields;
}

/**
 * Describes the hook a form is built with, and the helpers that compose one.
 *
 * @typeParam FieldComponents - The field components bound.
 * @typeParam FormComponents - The form components bound, the package's and the foundation's.
 */
export interface SchemaFormHooks<
  FieldComponents extends Components,
  FormComponents extends Components,
> {
  /**
   * Builds a form from the library's own options, as `createFormHook` gives it.
   */
  readonly useAppForm: ReturnType<
    typeof createFormHook<FieldComponents, FormComponents>
  >["useAppForm"];

  /**
   * Builds a form from a schema.
   *
   * @remarks
   *   The schema's defaults are the values to start from, with the values given and then the
   *   draft's written over them. The schema is the validator in the dynamic slot, and the
   *   caller's validators fill the other slots. The form's change listener writes the draft,
   *   debounced, and a submit that returns forgets it. The form carries `Fields`, which draws
   *   it from its presentation.
   * @typeParam Values - The form's values, stated by the caller. A record of unknown values
   *   where the caller states none, which is what a generated form has.
   */
  readonly useSchemaForm: <Values = Record<string, unknown>>(
    options: UseSchemaFormOptions<Values>,
  ) => SchemaForm<Values, FieldComponents, FormComponents>;

  /**
   * Builds a reusable group of fields, as `createFormHook` gives it.
   */
  readonly withFieldGroup: ReturnType<
    typeof createFormHook<FieldComponents, FormComponents>
  >["withFieldGroup"];

  /**
   * Builds a component drawn over a form handed to it, as `createFormHook` gives it.
   */
  readonly withForm: ReturnType<typeof createFormHook<FieldComponents, FormComponents>>["withForm"];
}

/**
 * How long after a change the draft is written, in milliseconds.
 */
const DEBOUNCE = 300;

/**
 * Binds a component package's components to the form foundation.
 *
 * @remarks
 *   The library's own `createFormHook` runs once, over the foundation's contexts, so a field drawn
 *   by another package bound to the same contexts reads the same form. The foundation adds
 *   `Fields` to the form components, and every form built with either hook carries it.
 * @typeParam FieldComponents - The field components bound.
 * @typeParam FormComponents - The form components bound.
 */
export function createSchemaForm<
  FieldComponents extends Components,
  FormComponents extends Components,
>(
  components: SchemaFormComponents<FieldComponents, FormComponents>,
): SchemaFormHooks<FieldComponents, FormComponents & Generated> {
  const { fieldComponents, formComponents, layouts, renderers = [] } = components;
  const drawing: Drawing = { layouts, renderers };
  const hook = createFormHook({
    fieldComponents,
    fieldContext,
    formComponents: { ...formComponents, Fields },
    formContext,
  });

  /**
   * Builds a form from a schema.
   */
  function useSchemaForm<Values = Record<string, unknown>>(
    options: UseSchemaFormOptions<Values>,
  ): SchemaForm<Values, FieldComponents, FormComponents & Generated> {
    const description = useDescription(options, drawing);
    const { draft: scope, onSubmit, validators, values } = options;
    const draft = useDraft<Values>(
      scope && {
        app: scope.app,
        id: scope.id ?? description.id,
        schema: description.schema,
        store: scope.store,
      },
    );
    const shared = schemaFormOptions<Values>(description.schema, {
      engine: description.engine,
      values: draft.restored?.values ?? values,
    });
    const form = hook.useAppForm({
      ...shared,
      listeners: {
        onChange: ({ formApi }) => {
          draft.write(formApi.state.values);
        },
        onChangeDebounceMs: DEBOUNCE,
      },
      onSubmit: async ({ value }) => {
        await onSubmit?.({ value });
        draft.clear();
      },
      validators: { ...validators, onDynamic: shared.validators.onDynamic },
    });

    describeForm(form, { ...description, draft });

    return form;
  }

  return {
    useAppForm: hook.useAppForm,
    useSchemaForm,
    withFieldGroup: hook.withFieldGroup,
    withForm: hook.withForm,
  };
}
