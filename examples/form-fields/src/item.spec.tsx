import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAppForm } from "#hook.ts";
import { Item } from "#item.tsx";

const onRemove = vi.fn<() => void>();

/**
 * Draws the item under a form, as the foundation does.
 */
function Harness(): ReactElement {
  const form = useAppForm({ defaultValues: {} });

  return (
    <form.AppForm>
      <Item index={2} onRemove={onRemove}>
        <input aria-label="Inner" />
      </Item>
    </form.AppForm>
  );
}

describe("Item", () => {
  it("draws the members with the button that removes the item", () => {
    const { container, getByRole } = render(<Harness />);

    fireEvent.click(getByRole("button", { name: "Remove" }));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(container.querySelector<HTMLElement>(".item")?.dataset["index"]).toBe("2");
  });
});
