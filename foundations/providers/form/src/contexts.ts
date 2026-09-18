/**
 * The contexts every form in this design system shares.
 */

import { type Context, useContext } from "react";

import { type AnyFieldApi, type AnyFormApi, createFormHookContexts } from "@tanstack/react-form";

/**
 * The one set of contexts a bound field and a bound form both read.
 *
 * @remarks
 *   Built once, at module scope, because the contexts are compared by identity. A component package
 *   that called `createFormHookContexts` itself would build its own pair, and its fields would then
 *   read a form that no form component above them is writing.
 */
const contexts = createFormHookContexts();

/**
 * The context a bound field reads its own field through.
 *
 * @remarks
 *   Annotated, because the type the compiler works out names React's `Context` through a path
 *   into the store, which a declaration file cannot carry.
 */
export const fieldContext: Context<AnyFieldApi> = contexts.fieldContext;

/**
 * The context a bound form component reads its form through.
 *
 * @remarks
 *   Annotated for the same reason `fieldContext` is.
 */
export const formContext: Context<AnyFormApi> = contexts.formContext;

/**
 * Reads the field a bound field component is drawing.
 *
 * @remarks
 *   A component package binds its fields and forms to these contexts with `createFormHook`, and an
 *   application uses the `useAppForm` that comes back.
 */
export const useFieldContext = contexts.useFieldContext;

/**
 * Reads the form a bound form component is drawing.
 */
export const useFormContext = contexts.useFormContext;

/**
 * Reads the form a bound form component is drawing, typed over values of any shape.
 *
 * @remarks
 *   The library types the form it hands a form component over a record with no members, so
 *   every path into it is `never`. A component that draws a form of any shape, such as one
 *   generated from a schema, reads the form through this instead.
 */
export function useAnyForm(): AnyFormApi {
  return contexts.useFormContext();
}

/**
 * Reads the form in scope, or nothing.
 *
 * @remarks
 *   A form component reads the form it is drawing, and a field component reads the form its
 *   field belongs to, so a field drawn under `AppField` alone finds its form as well. Outside
 *   both there is nothing to read, and a caller falls back to what it reads without a form. The
 *   two contexts are typed as never empty, so each is widened to what it holds at run time.
 */
export function useFormInScope(): AnyFormApi | undefined {
  const form = useContext(formContext) as AnyFormApi | null;
  const field = useContext(fieldContext) as AnyFieldApi | null;

  return form ?? field?.form ?? undefined;
}
