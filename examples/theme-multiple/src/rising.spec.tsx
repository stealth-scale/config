import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Rising } from "#rising.tsx";

describe("Rising", () => {
  it("lists three risers, each at its own place in the stagger", () => {
    const { getAllByRole } = render(<Rising />);
    const risers = getAllByRole("listitem");

    expect(risers).toHaveLength(3);
    expect(new Set(risers.map((each) => each.className)).size).toBe(3);
  });

  it("runs the risers again under a new list when the button is pressed", () => {
    const { getByRole } = render(<Rising />);
    const before = getByRole("list");

    fireEvent.click(getByRole("button", { name: "Replay" }));

    expect(getByRole("list")).not.toBe(before);
  });

  it("draws the same list when it renders again", () => {
    const { getByRole, rerender } = render(<Rising />);
    const before = getByRole("list");

    rerender(<Rising />);

    expect(getByRole("list")).toBe(before);
  });
});
