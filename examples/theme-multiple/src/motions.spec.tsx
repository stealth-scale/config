import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Motions } from "#motions.tsx";

describe("Motions", () => {
  it("heads the section with the motions", () => {
    const { getByRole } = render(<Motions />);

    expect(getByRole("heading", { name: "Motions" })).toBeDefined();
  });

  it("twinkles three dots, each at its own place in the stagger", () => {
    const { getByText } = render(<Motions />);
    const dots = [...(getByText("Floating").parentElement?.querySelectorAll("span") ?? [])].slice(
      2,
    );

    expect(dots).toHaveLength(3);
    expect(new Set(dots.map((each) => each.className)).size).toBe(3);
  });

  it("crosses the sky with five streaks, each at its own place in the stagger", () => {
    const { getByText } = render(<Motions />);
    const streaks = [...getByText("A shower of meteors across the sky").querySelectorAll("span")];

    expect(streaks).toHaveLength(5);
    expect(new Set(streaks.map((each) => each.className)).size).toBe(5);
  });

  it("frames the stripes in a pane", () => {
    const { getByText } = render(<Motions />);

    expect(getByText("Stripes that drift with the scroll").parentElement?.className).not.toBe("");
  });

  it("ends with the list that rises in turn", () => {
    const { getAllByRole } = render(<Motions />);

    expect(getAllByRole("listitem")).toHaveLength(3);
  });

  it("draws the same section when it renders again", () => {
    const { getAllByRole, rerender } = render(<Motions />);

    rerender(<Motions />);

    expect(getAllByRole("listitem")).toHaveLength(3);
  });
});
