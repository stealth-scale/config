import { type ReactNode } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ColorModeContext, type ColorModeContextValue, useColorMode } from "#context.ts";

const HELD: ColorModeContextValue = {
  choice: "system",
  colorMode: "dark",
  setColorMode: () => {},
};

/**
 * Puts a value in scope without the provider that normally settles one.
 */
function holding({ children }: { children?: ReactNode }): ReactNode {
  return <ColorModeContext value={HELD}>{children}</ColorModeContext>;
}

describe("ColorModeContext", () => {
  it("holds nothing until something puts a value in scope", () => {
    expect(ColorModeContext).toHaveProperty("Provider");
  });
});

describe("useColorMode", () => {
  it("answers what the nearest value above it holds", () => {
    expect(renderHook(() => useColorMode(), { wrapper: holding }).result.current).toBe(HELD);
  });

  it("refuses to answer a mode nothing above it is writing", () => {
    expect(() => renderHook(() => useColorMode())).toThrow(/ColorModeProvider/u);
  });
});
