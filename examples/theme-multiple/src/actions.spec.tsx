import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Actions } from "#actions.tsx";

describe("Actions", () => {
  it("heads the section", () => {
    const { getByRole } = render(<Actions />);

    expect(getByRole("heading", { level: 2, name: "Actions" })).toBeDefined();
  });

  it("draws a button in every look", () => {
    const { getByRole } = render(<Actions />);

    expect.hasAssertions();

    for (const name of ["Save", "Cancel", "Options", "Edit", "Dismiss", "Learn more", "Preview"]) {
      expect(getByRole("button", { name })).toBeDefined();
    }
  });

  it("names each icon button in words", () => {
    const { getByRole } = render(<Actions />);

    expect(getByRole("button", { name: "Close" })).toBeDefined();
    expect(getByRole("button", { name: "Add" })).toBeDefined();
  });

  it("disables the one that says so and no other", () => {
    const { getAllByRole, getByRole } = render(<Actions />);

    expect(getByRole("button", { name: "Disabled" }).hasAttribute("disabled")).toBe(true);
    expect(getAllByRole("button").filter((each) => each.hasAttribute("disabled"))).toHaveLength(1);
  });

  it("types every button as a button", () => {
    const { getAllByRole } = render(<Actions />);

    expect.hasAssertions();

    for (const button of getAllByRole("button")) {
      expect(button.getAttribute("type")).toBe("button");
    }
  });
});
