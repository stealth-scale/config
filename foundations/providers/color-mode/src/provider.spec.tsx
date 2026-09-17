import { type ReactNode } from "react";

import { act, render, renderHook, type RenderHookResult } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { memoryStore, type SettingStore } from "@stealthscale/settings";
import { COLOR_MODE_ATTRIBUTE } from "@stealthscale/theme";

import { type ColorModeContextValue, useColorMode } from "#context.ts";
import { ColorModeProvider } from "#provider.tsx";

const KEY = "stealth.docs.color-mode";

/**
 * Tells the page which mode the machine asks for.
 */
function machine(dark: boolean): void {
  const matchMedia = (media: string): MediaQueryList =>
    ({
      addEventListener: (): void => undefined,
      matches: dark,
      media,
      removeEventListener: (): void => undefined,
      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the hook reads matches and the two listener methods, which is the whole of what this stub answers
    }) as unknown as MediaQueryList;

  vi.stubGlobal("matchMedia", matchMedia);
}

/**
 * Wraps a tree in a provider keeping its choice where the caller says.
 */
function wrapping(store: SettingStore) {
  return function Wrapper({ children }: { children?: ReactNode }): ReactNode {
    return (
      <ColorModeProvider app="docs" store={store}>
        {children}
      </ColorModeProvider>
    );
  };
}

/**
 * Reads the mode under a provider, starting from a document nobody has written an attribute on.
 */
function under(store: SettingStore): RenderHookResult<ColorModeContextValue, unknown> {
  document.documentElement.removeAttribute(COLOR_MODE_ATTRIBUTE);

  return renderHook(() => useColorMode(), { wrapper: wrapping(store) });
}

describe("ColorModeProvider", () => {
  it("follows the machine until somebody chooses", () => {
    machine(true);

    expect(under(memoryStore()).result.current).toStrictEqual(
      expect.objectContaining({ choice: "system", colorMode: "dark" }),
    );
  });

  it("draws in the mode somebody chose whatever the machine asks for", () => {
    machine(true);

    expect(under(memoryStore({ [KEY]: "light" })).result.current.colorMode).toBe("light");
  });

  it("writes the chosen mode where the stylesheet reads it", () => {
    machine(false);
    under(memoryStore({ [KEY]: "dark" }));

    expect(document.documentElement.getAttribute(COLOR_MODE_ATTRIBUTE)).toBe("dark");
  });

  it("writes no attribute for a choice to follow the machine", () => {
    machine(true);
    under(memoryStore());

    expect(document.documentElement.getAttribute(COLOR_MODE_ATTRIBUTE)).toBeNull();
  });

  it("takes the attribute back when somebody goes back to following the machine", () => {
    machine(false);

    const { result } = under(memoryStore({ [KEY]: "dark" }));

    act(() => {
      result.current.setColorMode("system");
    });

    expect(document.documentElement.getAttribute(COLOR_MODE_ATTRIBUTE)).toBeNull();
  });

  it("remembers what its setter was given", () => {
    machine(false);

    const store = memoryStore();
    const { result } = under(store);

    act(() => {
      result.current.setColorMode("dark");
    });

    expect(store.read(KEY)).toBe("dark");
    expect(result.current.colorMode).toBe("dark");
  });

  it("follows a choice another document made", () => {
    machine(false);

    const store = memoryStore();
    const { result } = under(store);

    act(() => {
      store.write(KEY, "dark");
    });

    expect(result.current.colorMode).toBe("dark");
  });

  it("settles the mode for a tree that is still empty", () => {
    machine(false);
    document.documentElement.removeAttribute(COLOR_MODE_ATTRIBUTE);
    render(<ColorModeProvider app="docs" store={memoryStore({ [KEY]: "dark" })} />);

    expect(document.documentElement.getAttribute(COLOR_MODE_ATTRIBUTE)).toBe("dark");
  });

  it("keeps one setter while the store it was given stays the same", () => {
    machine(false);

    const { rerender, result } = under(memoryStore());
    const held = result.current.setColorMode;

    rerender();

    expect(result.current.setColorMode).toBe(held);
  });
});
