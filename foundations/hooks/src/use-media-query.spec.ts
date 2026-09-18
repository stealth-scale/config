import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useMediaQuery } from "#use-media-query.ts";

interface Stub {
  fire: (query: string) => void;
  getWindow: () => typeof window;
  listeners: () => number;
  set: (query: string, matches: boolean) => void;
}

function stubWindow(initial: Readonly<Record<string, boolean>> = {}): Stub {
  const answers = new Map(Object.entries(initial));
  const listeners = new Map<string, Set<() => void>>();

  const matchMedia = (query: string): MediaQueryList => {
    const held = listeners.get(query) ?? new Set<() => void>();

    listeners.set(query, held);

    return {
      addEventListener: (_: string, fn: () => void) => held.add(fn),
      get matches() {
        return answers.get(query) ?? false;
      },
      removeEventListener: (_: string, fn: () => void) => held.delete(fn),
      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the hook reads matches and the two listener methods, which is the whole of what this stub answers
    } as unknown as MediaQueryList;
  };

  return {
    fire: (query) => {
      for (const fn of listeners.get(query) ?? []) fn();
    },
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the hook reads matchMedia alone off the window it is given
    getWindow: () => ({ matchMedia }) as unknown as typeof window,
    listeners: () => [...listeners.values()].reduce((total, held) => total + held.size, 0),
    set: (query, matches) => {
      answers.set(query, matches);
    },
  };
}

describe("useMediaQuery", () => {
  it("answers each query in the order it was asked", () => {
    const stub = stubWindow({ "(min-width: 40rem)": true, "(pointer: coarse)": false });
    const { result } = renderHook(() =>
      useMediaQuery(["(min-width: 40rem)", "(pointer: coarse)"], { getWindow: stub.getWindow }),
    );

    expect(result.current).toStrictEqual([true, false]);
  });

  it("answers the fallback on the first render", () => {
    const stub = stubWindow({ "(min-width: 40rem)": true });
    const { result } = renderHook(
      () => useMediaQuery(["(min-width: 40rem)"], { fallback: [true], getWindow: stub.getWindow }),
      { hydrate: false },
    );

    expect(result.current).toStrictEqual([true]);
  });

  it("answers false for a query the fallback does not name", () => {
    const stub = stubWindow();
    const { result } = renderHook(() =>
      useMediaQuery(["(min-width: 40rem)"], { fallback: [], getWindow: stub.getWindow }),
    );

    expect(result.current).toStrictEqual([false]);
  });

  it("asks the window on the first render when ssr is false", () => {
    const stub = stubWindow({ "(min-width: 40rem)": true });
    const { result } = renderHook(() =>
      useMediaQuery(["(min-width: 40rem)"], { getWindow: stub.getWindow, ssr: false }),
    );

    expect(result.current).toStrictEqual([true]);
  });

  it("re-reads every query when one of the lists changes", () => {
    const stub = stubWindow({ "(min-width: 40rem)": false, "(min-width: 60rem)": false });
    const { result } = renderHook(() =>
      useMediaQuery(["(min-width: 40rem)", "(min-width: 60rem)"], { getWindow: stub.getWindow }),
    );

    act(() => {
      stub.set("(min-width: 40rem)", true);
      stub.set("(min-width: 60rem)", true);
      stub.fire("(min-width: 40rem)");
    });

    expect(result.current).toStrictEqual([true, true]);
  });

  it("keeps a query holding a comma whole", () => {
    const stub = stubWindow({ "(min-width: 40rem), print": true });
    const { result } = renderHook(() =>
      useMediaQuery(["(min-width: 40rem), print"], { getWindow: stub.getWindow }),
    );

    expect(result.current).toStrictEqual([true]);
  });

  it("answers an empty array when no query is asked", () => {
    const stub = stubWindow();
    const { result } = renderHook(() => useMediaQuery([], { getWindow: stub.getWindow }));

    expect(result.current).toStrictEqual([]);
  });

  it("removes every listener when the component unmounts", () => {
    const stub = stubWindow();
    const { unmount } = renderHook(() =>
      useMediaQuery(["(min-width: 40rem)"], { getWindow: stub.getWindow }),
    );

    unmount();

    expect(stub.listeners()).toBe(0);
  });

  it("listens again when the queries change", () => {
    const stub = stubWindow({ "(min-width: 60rem)": true });
    const { rerender, result } = renderHook(
      ({ query }) => useMediaQuery([query], { getWindow: stub.getWindow }),
      { initialProps: { query: "(min-width: 40rem)" } },
    );

    rerender({ query: "(min-width: 60rem)" });

    expect(result.current).toStrictEqual([true]);
  });

  it("asks the page's own window when no getWindow is given", () => {
    const asked = vi.spyOn(globalThis.window, "matchMedia");

    renderHook(() => useMediaQuery(["(min-width: 40rem)"]));

    expect(asked).toHaveBeenCalledWith("(min-width: 40rem)");

    asked.mockRestore();
  });

  it("asks the page's own window on the first render when ssr is false", () => {
    const asked = vi.spyOn(globalThis.window, "matchMedia");

    renderHook(() => useMediaQuery(["(min-width: 40rem)"], { ssr: false }));

    expect(asked).toHaveBeenCalledWith("(min-width: 40rem)");

    asked.mockRestore();
  });

  it("answers the fallback entry for a query the fallback names", () => {
    const stub = stubWindow();
    const { result } = renderHook(
      () =>
        useMediaQuery(["(min-width: 40rem)", "(min-width: 60rem)"], {
          fallback: [true],
          getWindow: stub.getWindow,
          ssr: true,
        }),
      { hydrate: false },
    );

    expect(result.current).toStrictEqual([false, false]);
  });
});
