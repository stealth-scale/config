import { type ReactNode } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useViewport, ViewportContext, type ViewportContextValue } from "#context.ts";
import { sizesOf } from "#size.ts";

/**
 * Stands in for a setter, which a value put in scope by hand never calls.
 */
function nothing(): void {
  return undefined;
}

const HELD: ViewportContextValue = {
  setWidth: nothing,
  sizes: [{ min: 400, name: "phone" }],
  width: 390,
};

/**
 * Puts a viewport in scope without the provider that normally settles one.
 */
function holding({ children }: { children?: ReactNode }): ReactNode {
  return <ViewportContext value={HELD}>{children}</ViewportContext>;
}

describe("useViewport", () => {
  it("answers what the nearest value above it holds", () => {
    expect(renderHook(() => useViewport(), { wrapper: holding }).result.current).toBe(HELD);
  });

  it("leaves the window to decide where nothing above states a width", () => {
    expect(renderHook(() => useViewport()).result.current.width).toBeUndefined();
  });

  it("offers the design system's own breakpoints outside a provider", () => {
    expect(renderHook(() => useViewport()).result.current.sizes).toStrictEqual(sizesOf());
  });

  it("changes nothing when asked to lay out for a width outside a provider", () => {
    const { result } = renderHook(() => useViewport());

    result.current.setWidth(600);

    expect(result.current.width).toBeUndefined();
  });
});
