import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FormProvider, type GroupProps, translateFrom } from "@stealthscale/provider-form";

import { Group } from "#group.tsx";
import { useAppForm } from "#hook.ts";

/**
 * Draws the group under a form, as the foundation does.
 */
function Harness(props: Omit<GroupProps, "children">): ReactElement {
  const form = useAppForm({ defaultValues: {} });

  return (
    <form.AppForm>
      <Group {...props}>
        <input aria-label="Inner" />
      </Group>
    </form.AppForm>
  );
}

describe("Group", () => {
  it("draws a fieldset with the legend where it has one", () => {
    const { getByText } = render(<Harness legend="Billing" />);

    expect(getByText("Billing").tagName).toBe("LEGEND");
  });

  it("draws the layout alone where it has no legend", () => {
    const { container } = render(<Harness direction="row" />);

    expect(container.querySelector("fieldset")).toBeNull();
    expect(container.querySelector(".row input")).not.toBeNull();
  });

  it("draws a grid where it has columns", () => {
    const { container } = render(<Harness columns={3} />);

    expect(container.querySelector(".grid.columns-3 input")).not.toBeNull();
  });

  it("draws a disclosure where it starts closed", () => {
    const { container } = render(<Harness closed legend="Billing" />);

    expect(container.querySelector("details > summary")?.textContent).toBe("Billing");
  });

  it("draws the button that adds an item where it is a repeat group", () => {
    const onAdd = vi.fn<() => void>();
    const words = translateFrom({ "form.actions.add": "Add a line" });
    const { getByRole } = render(
      <FormProvider translate={words}>
        <Harness legend="Lines" onAdd={onAdd} />
      </FormProvider>,
    );

    fireEvent.click(getByRole("button", { name: "Add a line" }));

    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});
