import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useRootNode } from "#context.ts";
import { EnvironmentProvider, type EnvironmentProviderProps } from "#provider.tsx";

/**
 * A shadow root, which is a node that is not a document and owns one.
 */
const SHADOW = document.createElement("div").attachShadow({ mode: "open" });

/**
 * Reads the getter in scope under a provider holding one value.
 *
 * @param value - What the provider is given.
 * @returns The node the getter returns.
 */
function rooted(
  value?: EnvironmentProviderProps["value"],
): ReturnType<ReturnType<typeof useRootNode>> {
  const { result } = renderHook(() => useRootNode(), {
    wrapper: ({ children }) => <EnvironmentProvider value={value}>{children}</EnvironmentProvider>,
  });

  return result.current();
}

describe("EnvironmentProvider", () => {
  it("holds the page's document when it is given no value", () => {
    expect(rooted()).toBe(globalThis.document);
  });

  it("holds a node it is given", () => {
    expect(rooted(SHADOW)).toBe(SHADOW);
  });

  it("holds a getter it is given", () => {
    expect(rooted(() => SHADOW)).toBe(SHADOW);
  });

  it("holds a document it is given", () => {
    const elsewhere = document.implementation.createHTMLDocument();

    expect(rooted(elsewhere)).toBe(elsewhere);
  });
});
