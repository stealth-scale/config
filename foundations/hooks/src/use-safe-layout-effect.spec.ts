import { useEffect, useLayoutEffect } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { layoutEffect, useSafeLayoutEffect } from "#use-safe-layout-effect.ts";

describe("useSafeLayoutEffect", () => {
  it("is the layout effect where a document exists", () => {
    expect(useSafeLayoutEffect).toBe(useLayoutEffect);
  });

  it("picks the layout effect when a document is given", () => {
    expect(layoutEffect(globalThis.document)).toBe(useLayoutEffect);
  });

  it("picks the plain effect when no document is given", () => {
    expect(layoutEffect()).toBe(useEffect);
  });

  it("runs the effect it was given", () => {
    const ran = vi.fn();

    renderHook(() => {
      useSafeLayoutEffect(ran);
    });

    expect(ran).toHaveBeenCalledTimes(1);
  });

  it("runs the cleanup when the component unmounts", () => {
    const cleaned = vi.fn();
    const { unmount } = renderHook(() => {
      useSafeLayoutEffect(() => cleaned);
    });

    unmount();

    expect(cleaned).toHaveBeenCalledTimes(1);
  });
});
