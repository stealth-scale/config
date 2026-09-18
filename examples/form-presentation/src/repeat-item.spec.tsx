import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RepeatItem } from "#repeat-item.tsx";

describe("RepeatItem", () => {
  it("draws the members and removes the item from its button", () => {
    const removed = vi.fn<() => void>();
    const { getByRole, getByText } = render(
      <RepeatItem onRemove={removed}>
        <p>member</p>
      </RepeatItem>,
    );

    fireEvent.click(getByRole("button", { name: "Remove" }));

    expect(getByText("member").parentElement?.className).toBe("item");
    expect(removed).toHaveBeenCalledTimes(1);
  });
});
