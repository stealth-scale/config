import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { NavProvider, useNav } from "#sidebar/state.ts";

/**
 * Reads the block's state through the hook its heading reads it through.
 *
 * @returns The identifier the heading carries.
 */
function Reader(): ReactElement {
  const nav = useNav();

  return <span data-testid="held">{nav.labelId}</span>;
}

describe("useNav", () => {
  it("answers what the provider above it holds", () => {
    render(
      <NavProvider value={{ labelId: "workspace" }}>
        <Reader />
      </NavProvider>,
    );

    expect(screen.getByTestId("held").textContent).toBe("workspace");
  });

  it("throws where no block stands above the reader", () => {
    expect(() => render(<Reader />)).toThrow(/Sidebar\.Nav/u);
  });
});
