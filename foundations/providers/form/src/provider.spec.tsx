import { type ReactNode } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createEngine } from "#engine.ts";
import { defaultEnvironment, useFormEnvironment } from "#environment.ts";
import { FormProvider, type FormProviderProps } from "#provider.tsx";
import { type Renderer } from "#renderer.ts";
import { type Translate } from "#translate.ts";

const engine = createEngine();
const renderers: readonly Renderer[] = [{ draw: () => null, suits: () => 1 }];
const translate: Translate = (_keys, { defaultValue }) => `${defaultValue}!`;

/**
 * Wraps a tree in a provider given the props stated.
 */
function wrapping(...layers: readonly FormProviderProps[]) {
  return function Wrapper({ children }: { children?: ReactNode }): ReactNode {
    return layers.reduceRight<ReactNode>(
      (inner, props) => <FormProvider {...props}>{inner}</FormProvider>,
      children,
    );
  };
}

describe("FormProvider", () => {
  it("puts the engine, the renderers and the translator in scope", () => {
    const { result } = renderHook(() => useFormEnvironment(), {
      wrapper: wrapping({ engine, renderers, translate }),
    });

    expect(result.current).toStrictEqual({ engine, renderers, translate });
  });

  it("reads the defaults for whatever it leaves out", () => {
    const { result } = renderHook(() => useFormEnvironment(), { wrapper: wrapping({ translate }) });

    expect(result.current).toStrictEqual({
      engine: defaultEnvironment().engine,
      renderers: [],
      translate,
    });
  });

  it("reads the provider above for whatever an inner one leaves out", () => {
    const { result } = renderHook(() => useFormEnvironment(), {
      wrapper: wrapping({ engine, renderers }, { translate }),
    });

    expect(result.current).toStrictEqual({ engine, renderers, translate });
  });

  it("keeps one value while its props stay the same", () => {
    const { rerender, result } = renderHook(() => useFormEnvironment(), {
      wrapper: wrapping({ engine }),
    });
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });
});
