import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useConst } from "#use-const.ts";

describe("useConst", () => {
  it("returns the same value on every render", () => {
    const { rerender, result } = renderHook(() => useConst(() => ({})));
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });

  it("calls the builder once across many renders", () => {
    const build = vi.fn(() => ({}));
    const { rerender } = renderHook(() => useConst(build));

    rerender();
    rerender();

    expect(build).toHaveBeenCalledTimes(1);
  });

  it("keeps a value that is not a function as it was given", () => {
    const value = { held: 1 };
    const { result } = renderHook(() => useConst(value));

    expect(result.current).toBe(value);
  });

  it("ignores a later initial value", () => {
    const { rerender, result } = renderHook(({ seed }) => useConst(seed), {
      initialProps: { seed: "first" },
    });

    rerender({ seed: "second" });

    expect(result.current).toBe("first");
  });
});
