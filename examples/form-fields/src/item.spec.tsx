import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useAppForm } from "#hook.ts";
import { Item } from "#item.tsx";

const onRemove = vi.fn<() => void>();

/**
 * Draws the item under a form, as the foundation does.
 */
function Harness({ removable = true }: { readonly removable?: boolean }): ReactElement {
  const form = useAppForm({ defaultValues: {} });

  return (
    <form.AppForm>
      <Item id="lines-2" index={2} onRemove={removable ? onRemove : undefined}>
        <input aria-label="Inner" />
      </Item>
    </form.AppForm>
  );
}

describe("Item", () => {
  it("draws the members with the button that removes the item", () => {
    const { container, getByRole } = render(<Harness />);
    const item = container.querySelector<HTMLElement>(".item");

    fireEvent.click(getByRole("button", { name: "Remove" }));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(item?.dataset["index"]).toBe("2");
    expect(item?.id).toBe("lines-2");
  });

  it("draws no button where the item cannot be removed", () => {
    const { getByLabelText, queryByRole } = render(<Harness removable={false} />);

    expect(queryByRole("button")).toBeNull();
    expect(getByLabelText("Inner")).toBeDefined();
  });
});
