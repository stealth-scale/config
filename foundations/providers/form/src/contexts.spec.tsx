import { type ReactNode } from "react";

import { type AnyFieldApi, type AnyFormApi, FieldApi, FormApi } from "@tanstack/react-form";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  fieldContext,
  formContext,
  useAnyForm,
  useFieldContext,
  useFormContext,
  useFormInScope,
} from "#contexts.ts";

// eslint-disable-next-line typescript/no-unsafe-type-assertion -- the context is typed over the library's own alias for any form, whose last parameter a concrete form fixes to never
const form = new FormApi({ defaultValues: { email: "" } }) as AnyFormApi;

// eslint-disable-next-line typescript/no-unsafe-type-assertion -- the same, for the field
const field = new FieldApi({ form, name: "email" }) as AnyFieldApi;

/**
 * Puts the form in scope, as a bound form component does.
 */
function inScope({ children }: { children?: ReactNode }): ReactNode {
  return <formContext.Provider value={form}>{children}</formContext.Provider>;
}

/**
 * Puts the field in scope alone, as a bound field component drawn under no form component does.
 */
function inField({ children }: { children?: ReactNode }): ReactNode {
  return <fieldContext.Provider value={field}>{children}</fieldContext.Provider>;
}

describe("contexts", () => {
  it("returns the form put in scope", () => {
    expect(renderHook(() => useFormContext(), { wrapper: inScope }).result.current).toBe(form);
  });

  it("returns the same form typed over any values", () => {
    expect(renderHook(() => useAnyForm(), { wrapper: inScope }).result.current).toBe(form);
  });

  it("reads the form in scope through a form or through a field", () => {
    expect(renderHook(() => useFormInScope(), { wrapper: inScope }).result.current).toBe(form);
    expect(renderHook(() => useFormInScope(), { wrapper: inField }).result.current).toBe(form);
    expect(renderHook(() => useFormInScope()).result.current).toBeUndefined();
  });

  it("throws when a form is read outside a form", () => {
    expect(() => renderHook(() => useFormContext())).toThrow(/formContext/u);
    expect(() => renderHook(() => useAnyForm())).toThrow(/formContext/u);
  });

  it("throws when a field is read outside a field", () => {
    expect(() => renderHook(() => useFieldContext())).toThrow(/fieldContext/u);
  });

  it("keeps one pair of contexts for the package", () => {
    expect(fieldContext).toHaveProperty("Provider");
    expect(formContext).toHaveProperty("Provider");
  });
});
