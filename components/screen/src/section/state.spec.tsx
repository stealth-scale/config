import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SectionProvider, useSection } from "#section/state.ts";

/**
 * Reads the section's state through the hook a part reads it through.
 *
 * @returns The identifier the title carries.
 */
function Reader(): ReactElement {
  const section = useSection();

  return <span data-testid="held">{section.titleId}</span>;
}

describe("useSection", () => {
  it("answers what the provider above it holds", () => {
    render(
      <SectionProvider value={{ narrow: false, titleId: "billing" }}>
        <Reader />
      </SectionProvider>,
    );

    expect(screen.getByTestId("held").textContent).toBe("billing");
  });

  it("throws where no section stands above the reader", () => {
    expect(() => render(<Reader />)).toThrow(/Section/u);
  });
});
