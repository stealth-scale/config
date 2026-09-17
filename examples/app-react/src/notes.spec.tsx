import { render, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Notes from "#notes.mdx";

describe("notes", () => {
  it("renders the document as a component", () => {
    const { container } = render(<Notes />);
    const page = within(container);

    expect(page.getByRole("heading", { level: 1, name: "Release notes" })).toBeDefined();
    expect(page.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders a component the document imported", () => {
    const { container } = render(<Notes />);

    expect(within(container).getByText("@stealthscale/example-app-react 2.1.0")).toBeDefined();
  });
});
