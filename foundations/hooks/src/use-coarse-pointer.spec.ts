import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useCoarsePointer } from "#use-coarse-pointer.ts";

function answering(matches: boolean): () => void {
  const spy = vi.spyOn(globalThis.window, "matchMedia").mockImplementation(
    (query: string) =>
      ({
        addEventListener: () => {},
        matches,
        media: query,
        removeEventListener: () => {},
        // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the hook reads matches and the two listener methods, which is the whole of what this stub answers
      }) as unknown as MediaQueryList,
  );

  return () => {
    spy.mockRestore();
  };
}

describe("useCoarsePointer", () => {
  it("returns true when the pointer is coarse", () => {
    const restore = answering(true);
    const { result } = renderHook(() => useCoarsePointer());

    expect(result.current).toBe(true);

    restore();
  });

  it("returns false when the pointer is fine", () => {
    const restore = answering(false);
    const { result } = renderHook(() => useCoarsePointer());

    expect(result.current).toBe(false);

    restore();
  });

  it("asks for the coarse pointer query", () => {
    const spy = vi.spyOn(globalThis.window, "matchMedia");

    renderHook(() => useCoarsePointer());

    expect(spy).toHaveBeenCalledWith("(pointer: coarse)");

    spy.mockRestore();
  });
});
