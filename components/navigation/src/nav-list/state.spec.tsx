import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BranchProvider, useBranch } from "#nav-list/state.ts";

/**
 * Reads the branch's state through the hook its parts read it through.
 *
 * @returns The state, drawn as text.
 */
function Reader(): ReactElement {
  const branch = useBranch();

  return <span data-testid="state">{branch.open ? "open" : "closed"}</span>;
}

describe("useBranch", () => {
  it("answers what the provider above it holds", () => {
    render(
      <BranchProvider value={{ id: "rows", open: true, toggle: () => {} }}>
        <Reader />
      </BranchProvider>,
    );

    expect(screen.getByTestId("state").textContent).toBe("open");
  });

  it("throws where no branch stands above the reader", () => {
    expect(() => render(<Reader />)).toThrow(/NavList\.Branch/u);
  });
});
