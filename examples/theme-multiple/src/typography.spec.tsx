import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Typography } from "#typography.tsx";

describe("Typography", () => {
  it("heads the section", () => {
    const { getByRole } = render(<Typography />);

    expect(getByRole("heading", { level: 2, name: "Typography" })).toBeDefined();
  });

  it("names the labelled icon and hides the other", () => {
    const { container, getByRole } = render(<Typography />);

    expect(getByRole("img", { name: "Loading" })).toBeDefined();
    expect(container.querySelectorAll("svg[aria-hidden='true']")).toHaveLength(2);
  });

  it("draws the lists between the icons and the quotation", () => {
    const { getAllByRole } = render(<Typography />);

    expect(getAllByRole("list")).toHaveLength(6);
  });

  it("draws the quotation with its caption", () => {
    const { getByRole, getByText } = render(<Typography />);

    expect(getByRole("figure")).toBeDefined();
    expect(getByText("Someone, somewhere").tagName).toBe("FIGCAPTION");
  });
});
