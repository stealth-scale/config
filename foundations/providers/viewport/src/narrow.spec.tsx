import { createRef, type ReactNode, type RefObject } from "react";

import { act, renderHook, type RenderHookResult } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useNarrow } from "#narrow.ts";
import { ViewportProvider } from "#provider.tsx";

/**
 * The width under which the hook calls an element narrow, in every case here.
 */
const THRESHOLD = 600;

/**
 * Reaches the observers the hook built, so a case can report a size change or count the stops.
 */
interface Observers {
  resize: () => void;
  stopped: () => number;
}

/**
 * Reaches an element and the width it reports.
 */
interface Measured {
  ref: RefObject<HTMLElement | null>;
  reports: (width: number) => void;
}

/**
 * Puts a resize observer in place of the page's own, which this document implementation lacks.
 *
 * @remarks
 *   Observing reports the size at once, as the browser's own does, so a hook that measures on
 *   mount has something to measure.
 */
function observing(): Observers {
  const callbacks = new Set<() => void>();
  let stopped = 0;

  class Observer {
    readonly onResize: () => void;

    constructor(onResize: () => void) {
      this.onResize = onResize;
      callbacks.add(onResize);
    }

    disconnect(): void {
      stopped += 1;
      callbacks.delete(this.onResize);
    }

    observe(): void {
      this.onResize();
    }
  }

  vi.stubGlobal("ResizeObserver", Observer);

  return {
    resize: () => {
      for (const one of callbacks) one();
    },
    stopped: () => stopped,
  };
}

/**
 * Holds an element reporting the width a case gives it.
 */
function measuring(width: number): Measured {
  const element = document.createElement("div");
  const ref = createRef<HTMLElement>();
  let held = width;

  vi.spyOn(element, "getBoundingClientRect").mockImplementation(
    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the hook reads the width alone off what the element reports
    () => ({ width: held }) as DOMRect,
  );

  ref.current = element;

  return {
    ref,
    reports: (next) => {
      held = next;
    },
  };
}

/**
 * Reads the hook under a provider laid out for a width.
 */
function under(
  ref: RefObject<HTMLElement | null>,
  viewport: number,
  below?: string,
): RenderHookResult<boolean, unknown> {
  return renderHook(() => useNarrow(ref, THRESHOLD, below), {
    wrapper: ({ children }: { children?: ReactNode }) => (
      <ViewportProvider width={viewport}>{children}</ViewportProvider>
    ),
  });
}

describe("useNarrow", () => {
  it("answers from the element's own width once it has been measured", () => {
    observing();

    expect(under(measuring(400).ref, 4000).result.current).toBe(true);
  });

  it("calls an element wider than the width wide", () => {
    observing();

    expect(under(measuring(900).ref, 320).result.current).toBe(false);
  });

  it("measures again when the element changes size", () => {
    const observers = observing();
    const element = measuring(900);
    const { result } = under(element.ref, 320);

    element.reports(400);

    act(() => {
      observers.resize();
    });

    expect(result.current).toBe(true);
  });

  it("stops watching the element when the component unmounts", () => {
    const observers = observing();
    const { unmount } = under(measuring(900).ref, 320);

    unmount();

    expect(observers.stopped()).toBe(1);
  });

  it("takes the viewport's word while the ref holds nothing to measure", () => {
    observing();

    expect(under(createRef<HTMLElement>(), 320).result.current).toBe(true);
  });

  it("calls a wide viewport wide while the ref holds nothing", () => {
    observing();

    expect(under(createRef<HTMLElement>(), 4000).result.current).toBe(false);
  });

  it("guesses under the breakpoint a caller names in place of md", () => {
    observing();

    expect(under(createRef<HTMLElement>(), 800, "lg").result.current).toBe(true);
  });
});
