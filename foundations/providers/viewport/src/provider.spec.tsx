import { type ReactNode } from "react";

import { act, renderHook, type RenderHookResult } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useViewport, type ViewportContextValue } from "#context.ts";
import { ViewportProvider, type ViewportProviderProps } from "#provider.tsx";
import { type Size, sizesOf } from "#size.ts";

const PHONE: readonly Size[] = [{ min: 400, name: "phone" }];

/**
 * Reads the viewport under a provider carrying the props a case describes.
 */
function under(stated: ViewportProviderProps): RenderHookResult<ViewportContextValue, unknown> {
  return renderHook(() => useViewport(), {
    wrapper: ({ children }: { children?: ReactNode }) => (
      <ViewportProvider {...stated}>{children}</ViewportProvider>
    ),
  });
}

describe("ViewportProvider", () => {
  it("leaves the window to decide until a width is stated", () => {
    expect(under({}).result.current.width).toBeUndefined();
  });

  it("lays the subtree out for the width it starts at", () => {
    expect(under({ width: 390 }).result.current.width).toBe(390);
  });

  it("offers the design system's own breakpoints where no sizes are named", () => {
    expect(under({}).result.current.sizes).toStrictEqual(sizesOf());
  });

  it("offers the sizes it was given in place of them", () => {
    expect(under({ sizes: PHONE }).result.current.sizes).toBe(PHONE);
  });

  it("lays the subtree out for a width its setter is given", () => {
    const { result } = under({});

    act(() => {
      result.current.setWidth(768);
    });

    expect(result.current.width).toBe(768);
  });

  it("gives the window back when its setter is given nothing", () => {
    const { result } = under({ width: 390 });

    act(() => {
      result.current.setWidth(undefined);
    });

    expect(result.current.width).toBeUndefined();
  });

  it("draws a subtree that is still empty", () => {
    expect(under({}).result.current.sizes.length).toBeGreaterThan(0);
  });
});
