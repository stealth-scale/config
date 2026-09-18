import { type ReactElement, type ReactNode } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  type GetRootNode,
  RootNodeContext,
  useEnvironmentDocument,
  useRootNode,
} from "#context.ts";

/**
 * A shadow root, which is a node that is not a document and owns one.
 */
const SHADOW = document.createElement("div").attachShadow({ mode: "open" });

/**
 * Builds a wrapper that holds one getter.
 *
 * @param getRootNode - The getter to hold.
 * @returns The wrapper `renderHook` mounts the reader under.
 */
function holding(getRootNode: GetRootNode) {
  return function Wrapper({ children }: { readonly children?: ReactNode }): ReactElement {
    return <RootNodeContext value={getRootNode}>{children}</RootNodeContext>;
  };
}

describe("useRootNode", () => {
  it("returns the page's document outside every provider", () => {
    expect(renderHook(() => useRootNode()).result.current()).toBe(globalThis.document);
  });

  it("returns the getter the context holds", () => {
    const { result } = renderHook(() => useRootNode(), { wrapper: holding(() => SHADOW) });

    expect(result.current()).toBe(SHADOW);
  });
});

describe("useEnvironmentDocument", () => {
  it("returns the page's document outside every provider", () => {
    expect(renderHook(() => useEnvironmentDocument()).result.current).toBe(globalThis.document);
  });

  it("returns a document the context holds", () => {
    const elsewhere = document.implementation.createHTMLDocument();
    const { result } = renderHook(() => useEnvironmentDocument(), {
      wrapper: holding(() => elsewhere),
    });

    expect(result.current).toBe(elsewhere);
  });

  it("returns the owning document of a shadow root", () => {
    const { result } = renderHook(() => useEnvironmentDocument(), {
      wrapper: holding(() => SHADOW),
    });

    expect(result.current).toBe(globalThis.document);
  });

  it("returns the owning document of an element in another document", () => {
    const elsewhere = document.implementation.createHTMLDocument();
    const { result } = renderHook(() => useEnvironmentDocument(), {
      wrapper: holding(() => elsewhere.documentElement),
    });

    expect(result.current).toBe(elsewhere);
  });
});
