import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Looks } from "#looks.tsx";

describe("Looks", () => {
  it("heads the section in gradient text", () => {
    const { getByRole } = render(<Looks />);

    expect(getByRole("heading", { name: "Looks" })).toBeDefined();
  });

  it("wears three glows and three blurs on chips", () => {
    const { getByText } = render(<Looks />);

    expect(getByText("Glow sm").className).not.toBe(getByText("Glow lg").className);
    expect(getByText("Blur sm").className).not.toBe(getByText("Blur lg").className);
  });

  it("sets the glass over the aurora and the grid under the mask", () => {
    const { getByText } = render(<Looks />);

    expect(getByText("Glass over an aurora").parentElement?.className).not.toBe("");
    expect(getByText("A grid masked to an ellipse").parentElement?.className).not.toBe("");
  });

  it("lights the tile below the masks", () => {
    const { getByText } = render(<Looks />);

    expect(getByText("A spotlight under the pointer")).toBeDefined();
  });

  it("draws the same section when it renders again", () => {
    const { getAllByText, rerender } = render(<Looks />);

    rerender(<Looks />);

    expect(getAllByText(/^(Glow|Blur) (sm|md|lg)$/u)).toHaveLength(6);
  });
});
