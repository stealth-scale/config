import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useLiveRef } from "#use-live-ref.ts";

describe("useLiveRef", () => {
  it("points at the value the first render was given", () => {
    const { result } = renderHook(() => useLiveRef("first"));

    expect(result.current.current).toBe("first");
  });

  it("points at the value the latest render was given", () => {
    const { rerender, result } = renderHook(({ value }) => useLiveRef(value), {
      initialProps: { value: "first" },
    });

    rerender({ value: "second" });

    expect(result.current.current).toBe("second");
  });

  it("keeps one ref object across renders", () => {
    const { rerender, result } = renderHook(({ value }) => useLiveRef(value), {
      initialProps: { value: "first" },
    });
    const first = result.current;

    rerender({ value: "second" });

    expect(result.current).toBe(first);
  });
});
