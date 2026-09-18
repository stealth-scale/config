import { type ReactNode } from "react";

import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormNameContext, useFormName } from "#name.ts";

/**
 * Names the form being drawn.
 */
function naming({ children }: { children?: ReactNode }): ReactNode {
  return <FormNameContext value="checkout">{children}</FormNameContext>;
}

describe("useFormName", () => {
  it("returns form where nobody named the form", () => {
    expect(renderHook(() => useFormName()).result.current).toBe("form");
  });

  it("returns the identifier set around it", () => {
    expect(renderHook(() => useFormName(), { wrapper: naming }).result.current).toBe("checkout");
  });
});
