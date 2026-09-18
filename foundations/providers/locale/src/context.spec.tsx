import { type ReactElement, type ReactNode } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LocaleContext, type LocaleContextValue, useLocale } from "#context.ts";

const HELD: LocaleContextValue = {
  direction: "rtl",
  isPending: false,
  locale: "ar-EG",
  locales: ["en", "ar-EG"],
  setLocale: () => {},
};

/**
 * Mounts a reader under a context holding one value.
 *
 * @param props - The reader.
 * @param props.children - The reader.
 * @returns The reader, under the context.
 */
function holding({ children }: { readonly children?: ReactNode }): ReactElement {
  return <LocaleContext value={HELD}>{children}</LocaleContext>;
}

describe("useLocale", () => {
  it("returns what the context above it holds", () => {
    expect(renderHook(() => useLocale(), { wrapper: holding }).result.current).toBe(HELD);
  });

  it("throws when no provider stands above it", () => {
    expect(() => renderHook(() => useLocale())).toThrow(/LocaleProvider/u);
  });
});
