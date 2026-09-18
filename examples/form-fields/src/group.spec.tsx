import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FormProvider, type GroupProps, translateFrom } from "@stealthscale/provider-form";

import { Group } from "#group.tsx";
import { useAppForm } from "#hook.ts";

/**
 * Draws the group under a form, as the foundation does.
 */
function Harness(props: Omit<GroupProps, "children" | "id">): ReactElement {
  const form = useAppForm({ defaultValues: {} });

  return (
    <form.AppForm>
      <Group {...props} id="lines">
        <input aria-label="Inner" />
      </Group>
    </form.AppForm>
  );
}

describe("Group", () => {
  it("draws a fieldset carrying the id where it has a legend", () => {
    const { getByText } = render(<Harness legend="Billing" />);
    const legend = getByText("Billing");

    expect(legend.tagName).toBe("LEGEND");
    expect(legend.closest("fieldset")?.id).toBe("lines");
  });

  it("draws the layout alone under an element carrying the id where it has no legend", () => {
    const { container } = render(<Harness direction="row" />);

    expect(container.querySelector("fieldset")).toBeNull();
    expect(container.querySelector("#lines > .row > input")).not.toBeNull();
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
