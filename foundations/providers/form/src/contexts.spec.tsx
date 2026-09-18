import { type ReactNode } from "react";

import { type AnyFormApi, FormApi } from "@tanstack/react-form";
import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { fieldContext, formContext, useFieldContext, useFormContext } from "#contexts.ts";

// eslint-disable-next-line typescript/no-unsafe-type-assertion -- the context is typed over the library's own alias for any form, whose last parameter a concrete form fixes to never
const form = new FormApi({ defaultValues: { email: "" } }) as AnyFormApi;

/**
 * Puts the form in scope, as a bound form component does.
 */
function inScope({ children }: { children?: ReactNode }): ReactNode {
  return <formContext.Provider value={form}>{children}</formContext.Provider>;
}

describe("contexts", () => {
  it("returns the form put in scope", () => {
    expect(renderHook(() => useFormContext(), { wrapper: inScope }).result.current).toBe(form);
  });

  it("throws when a form is read outside a form", () => {
    expect(() => renderHook(() => useFormContext())).toThrow(/formContext/u);
  });

  it("throws when a field is read outside a field", () => {
    expect(() => renderHook(() => useFieldContext())).toThrow(/fieldContext/u);
  });

  it("keeps one pair of contexts for the package", () => {
    expect(fieldContext).toHaveProperty("Provider");
    expect(formContext).toHaveProperty("Provider");
  });
});
