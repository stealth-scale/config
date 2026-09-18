import { type ReactElement } from "react";
import { renderToString } from "react-dom/server";

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useSystemColorMode } from "#scheme.ts";

interface Machine {
  asks: (dark: boolean) => void;
  listeners: () => number;
}

/**
 * Renders the mode the machine asks for, so a server can be asked the same question.
 */
function Show(): ReactElement {
  return <i>{useSystemColorMode()}</i>;
}

/**
 * Puts a machine in place of the page's own, whose setting a case can change.
 */
function machine(dark: boolean): Machine {
  const listeners = new Set<() => void>();
  let matches = dark;

  const matchMedia = (media: string): MediaQueryList =>
    ({
      addEventListener: (_: string, fn: () => void): void => void listeners.add(fn),
      get matches() {
        return matches;
      },
      media,
      removeEventListener: (_: string, fn: () => void): void => void listeners.delete(fn),
      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the hook reads matches and the two listener methods, which is the whole of what this stub answers
    }) as unknown as MediaQueryList;

  vi.stubGlobal("matchMedia", matchMedia);

  return {
    asks: (next) => {
      matches = next;
      for (const fn of listeners) fn();
    },
    listeners: () => listeners.size,
  };
}

describe("useSystemColorMode", () => {
  it("answers light where the machine asks for nothing", () => {
    machine(false);

    expect(renderHook(() => useSystemColorMode()).result.current).toBe("light");
  });

  it("answers dark where the machine asks for it", () => {
    machine(true);

    expect(renderHook(() => useSystemColorMode()).result.current).toBe("dark");
  });

  it("follows the machine as somebody changes it", () => {
    const held = machine(false);
    const { result } = renderHook(() => useSystemColorMode());

    act(() => {
      held.asks(true);
    });

    expect(result.current).toBe("dark");
  });

  it("stops listening when the component unmounts", () => {
    const held = machine(false);
    const { unmount } = renderHook(() => useSystemColorMode());

    unmount();

    expect(held.listeners()).toBe(0);
  });

  it("answers light where the page cannot be asked", () => {
    vi.stubGlobal("matchMedia", null);

    expect(renderHook(() => useSystemColorMode()).result.current).toBe("light");
  });

  it("answers light on a server, which has no reader to ask", () => {
    expect(renderToString(<Show />)).toContain("light");
  });
});
