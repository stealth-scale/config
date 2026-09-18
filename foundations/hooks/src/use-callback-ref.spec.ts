import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useCallbackRef } from "#use-callback-ref.ts";

describe("useCallbackRef", () => {
  it("keeps one identity across renders when no dependencies are stated", () => {
    const { rerender, result } = renderHook(({ fn }) => useCallbackRef(fn), {
      initialProps: { fn: (): number => 1 },
    });
    const first = result.current;

    rerender({ fn: (): number => 2 });

    expect(result.current).toBe(first);
  });

  it("calls the callback the latest render passed", () => {
    const { rerender, result } = renderHook(({ fn }) => useCallbackRef(fn), {
      initialProps: { fn: (): number => 1 },
    });

    rerender({ fn: (): number => 2 });

    expect(result.current()).toBe(2);
  });

  it("passes every argument through to the callback", () => {
    const spy = vi.fn((first: number, second: string) => `${String(first)}${second}`);
    const { result } = renderHook(() => useCallbackRef(spy));

    expect(result.current(1, "a")).toBe("1a");
    expect(spy).toHaveBeenCalledWith(1, "a");
  });

  it("returns undefined when no callback was given", () => {
    const { result } = renderHook(() => useCallbackRef<[], number>());

    expect(result.current()).toBeUndefined();
  });

  it("changes identity when a stated dependency changes", () => {
    const { rerender, result } = renderHook(({ dep }) => useCallbackRef(() => dep, [dep]), {
      initialProps: { dep: 1 },
    });
    const first = result.current;

    rerender({ dep: 2 });

    expect(result.current).not.toBe(first);
  });
});
