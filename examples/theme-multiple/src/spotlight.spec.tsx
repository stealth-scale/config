import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Spotlight } from "#spotlight.tsx";

const LABEL = "A spotlight under the pointer";

describe("Spotlight", () => {
  it("lights where the pointer is, as a share of the tile on each axis", () => {
    const { getByText } = render(<Spotlight />);
    const tile = getByText(LABEL);
    vi.spyOn(tile, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 200, 50));

    fireEvent.pointerMove(tile, { clientX: 50, clientY: 25 });

    expect(tile.style.getPropertyValue("--spotlight-x")).toBe("25.0%");
    expect(tile.style.getPropertyValue("--spotlight-y")).toBe("50.0%");
  });

  it("lights the corner of a tile that has no size yet", () => {
    const { getByText } = render(<Spotlight />);
    const tile = getByText(LABEL);

    fireEvent.pointerMove(tile, { clientX: 0, clientY: 0 });

    expect(tile.style.getPropertyValue("--spotlight-x")).toBe("0.0%");
    expect(tile.style.getPropertyValue("--spotlight-y")).toBe("0.0%");
  });

  it("draws the same tile when it renders again", () => {
    const { getByText, rerender } = render(<Spotlight />);

    rerender(<Spotlight />);

    expect(getByText(LABEL)).toBeDefined();
  });
});
