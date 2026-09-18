import { type ReactElement, type ReactNode } from "react";
import { renderToString } from "react-dom/server";

import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  type Responsive,
  useBreakpoint,
  type UseBreakpointOptions,
  useBreakpointValue,
} from "#breakpoint.ts";
import { ViewportProvider } from "#provider.tsx";
import { type Breakpoint } from "#size.ts";

const EVERY: readonly Breakpoint[] = ["base", "sm", "md", "lg", "xl", "2xl"];

/**
 * Answers a window whose every query matches at or under the width a case names.
 */
function windowAt(width: number): () => typeof window {
  const matchMedia = (media: string): MediaQueryList =>
    ({
      addEventListener: (): void => undefined,
      matches: Number(/\d+/u.exec(media)?.[0] ?? 0) <= width,
      media,
      removeEventListener: (): void => undefined,
      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the hook reads matches and the two listener methods, which is the whole of what this stub answers
    }) as unknown as MediaQueryList;

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the hook reads matchMedia alone off the window it is given
  return () => ({ matchMedia }) as unknown as typeof window;
}

/**
 * Renders the breakpoint, so a server can be asked which one it reads.
 */
function Show(): ReactElement {
  return <i>{useBreakpoint({ breakpoints: EVERY, getWindow: windowAt(4000), ssr: true })}</i>;
}

/**
 * Lays a subtree out for a width, so the hooks read it rather than the window.
 */
function laidOut(width: number | undefined) {
  return function Wrapper({ children }: { children?: ReactNode }): ReactNode {
    return <ViewportProvider width={width}>{children}</ViewportProvider>;
  };
}

/**
 * Reads the breakpoint under a provider laid out for a width.
 */
function at(width: number | undefined, options: UseBreakpointOptions = {}): string {
  return renderHook(() => useBreakpoint({ breakpoints: EVERY, ...options }), {
    wrapper: laidOut(width),
  }).result.current;
}

/**
 * Reads the value stated for the breakpoint a provider is laid out for.
 */
function valueAt<Value>(width: number, value: Responsive<Value>): undefined | Value {
  return renderHook(() => useBreakpointValue(value), { wrapper: laidOut(width) }).result.current;
}

describe("useBreakpoint", () => {
  it("answers the widest breakpoint that starts at or under the stated width", () => {
    expect(at(800)).toBe("md");
  });

  it("answers base for a width narrower than every breakpoint", () => {
    expect(at(320)).toBe("base");
  });

  it("answers the widest breakpoint of all for a width past the last one", () => {
    expect(at(4000)).toBe("2xl");
  });

  it("answers the breakpoint that starts exactly at the width", () => {
    expect(at(640)).toBe("sm");
  });

  it("counts only the breakpoints it was asked for", () => {
    expect(at(800, { breakpoints: ["base", "lg"] })).toBe("base");
  });

  it("answers the fallback where no breakpoint was asked for", () => {
    expect(at(800, { breakpoints: [] })).toBe("base");
  });

  it("answers the fallback a caller names in place of base", () => {
    expect(at(800, { breakpoints: [], fallback: "md" })).toBe("md");
  });

  it("asks the window where no provider states a width", () => {
    expect(at(undefined, { getWindow: windowAt(800), ssr: false })).toBe("md");
  });

  it("answers the fallback on a server so its markup matches the first paint", () => {
    expect(renderToString(<Show />)).toContain("base");
  });

  it("prefers the stated width over the window", () => {
    expect(at(320, { getWindow: windowAt(4000), ssr: false })).toBe("base");
  });

  it("asks the window nothing where a provider states the width", () => {
    const asked = vi.fn<(query: string) => MediaQueryList>();

    // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the hook reads matchMedia alone off the window it is given
    const getWindow = (): typeof window => ({ matchMedia: asked }) as unknown as typeof window;

    expect(at(800, { getWindow, ssr: false })).toBe("md");
    expect(asked).not.toHaveBeenCalled();
  });
});

describe("useBreakpointValue", () => {
  it("answers the value stated for the breakpoint the viewport is at", () => {
    expect(valueAt(800, { base: "one", md: "two" })).toBe("two");
  });

  it("takes the nearest narrower value where the breakpoint states none", () => {
    expect(valueAt(4000, { base: "one", md: "two" })).toBe("two");
  });

  it("answers nothing where no breakpoint at or under the viewport states one", () => {
    expect(valueAt(320, { md: "two" })).toBeUndefined();
  });

  it("reads a value listed in the theme's order", () => {
    expect(valueAt(800, ["one", "two", "three"])).toBe("three");
  });

  it("skips a gap in a list and takes the nearest narrower value", () => {
    expect(valueAt(800, ["one", null, null])).toBe("one");
  });

  it("leaves out anything listed past the last breakpoint", () => {
    expect(valueAt(4000, ["one", "two", "three", "four", "five", "six", "seven"])).toBe("six");
  });
});
