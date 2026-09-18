import { type ReactNode } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createEngine } from "#engine.ts";
import {
  defaultEnvironment,
  type FormEnvironment,
  FormEnvironmentContext,
  useFormEnvironment,
} from "#environment.ts";

const GIVEN: FormEnvironment = {
  engine: createEngine(),
  renderers: [],
  translate: (_keys, { defaultValue }) => `${defaultValue}!`,
};

/**
 * Puts an environment in scope without the provider that normally settles one.
 */
function holding({ children }: { children?: ReactNode }): ReactNode {
  return <FormEnvironmentContext value={GIVEN}>{children}</FormEnvironmentContext>;
}

describe("useFormEnvironment", () => {
  it("returns what the nearest value above it holds", () => {
    expect(renderHook(() => useFormEnvironment(), { wrapper: holding }).result.current).toBe(GIVEN);
  });

  it("returns the defaults where nothing above it holds a value", () => {
    expect(renderHook(() => useFormEnvironment()).result.current).toBe(defaultEnvironment());
  });

  it("keeps one default environment that answers the default for every key", () => {
    expect(defaultEnvironment()).toBe(defaultEnvironment());
    expect(defaultEnvironment().translate("anything", { defaultValue: "Email" })).toBe("Email");
  });
});
