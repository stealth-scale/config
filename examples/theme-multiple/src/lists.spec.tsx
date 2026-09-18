import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotVariantClass } from "@stealthscale/testing-theme";

import { Lists } from "#lists.tsx";

describe("Lists", () => {
  it("draws six lists with two entries each", () => {
    const { getAllByRole } = render(<Lists />);

    expect(getAllByRole("list")).toHaveLength(6);
    expect(getAllByRole("listitem")).toHaveLength(12);
  });

  it("marks the entries of a list with the marker its root names", () => {
    const { getAllByText, getByText } = render(<Lists />);

    expect(getAllByText("An en dash")[0]?.className).toContain(
      slotVariantClass("list", "item", "marker", "dash"),
    );
    expect(getByText("First").className).not.toContain("list__item--dash");
  });

  it("hides each drawn mark from assistive technology", () => {
    const { container } = render(<Lists />);

    expect(container.querySelectorAll("span[aria-hidden='true']")).toHaveLength(2);
  });
});
