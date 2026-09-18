import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useControllableState } from "#use-controllable-state.ts";

describe("useControllableState", () => {
  it("returns the default value when the caller states no value", () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: "closed" }));

    expect(result.current[0]).toBe("closed");
  });

  it("returns the caller's value when the caller states one", () => {
    const { result } = renderHook(() =>
      useControllableState({ defaultValue: "closed", value: "open" }),
    );

    expect(result.current[0]).toBe("open");
  });

  it("holds the value itself when the caller states none", () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: "closed" }));

    act(() => {
      result.current[1]("open");
    });

    expect(result.current[0]).toBe("open");
  });

  it("keeps the caller's value when the caller states one", () => {
    const { result } = renderHook(() => useControllableState({ value: "open" }));

    act(() => {
      result.current[1]("closed");
    });

    expect(result.current[0]).toBe("open");
  });

  it("tells onChange when the value changes", () => {
    const onChange = vi.fn<(value: number) => void>();
    const { result } = renderHook(() => useControllableState({ defaultValue: 1, onChange }));

    act(() => {
      result.current[1](2);
    });

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("tells onChange when the caller owns the value", () => {
    const onChange = vi.fn<(value: number) => void>();
    const { result } = renderHook(() => useControllableState({ onChange, value: 1 }));

    act(() => {
      result.current[1](2);
    });

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("passes over a set to the value it already holds", () => {
    const onChange = vi.fn<(value: number) => void>();
    const { result } = renderHook(() => useControllableState({ defaultValue: 1, onChange }));

    act(() => {
      result.current[1](1);
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("calls an updater with the value it holds", () => {
    const { result } = renderHook(() => useControllableState({ defaultValue: 1 }));

    act(() => {
      result.current[1]((previous) => previous + 1);
    });

    expect(result.current[0]).toBe(2);
  });

  it("follows a caller that starts stating a value partway through", () => {
    const { rerender, result } = renderHook(
      ({ value }: { value?: string }) => useControllableState({ defaultValue: "closed", value }),
      { initialProps: {} },
    );

    rerender({ value: "open" });

    expect(result.current[0]).toBe("open");
  });

  it("returns undefined when the caller states neither a value nor a default", () => {
    const { result } = renderHook(() => useControllableState<string | undefined>({}));

    expect(result.current[0]).toBeUndefined();
  });
});
