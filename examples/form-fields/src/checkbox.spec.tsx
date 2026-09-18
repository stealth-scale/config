import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAppForm } from "#hook.ts";

/**
 * Binds a checkbox to a consent that has to be given.
 */
function Harness(): ReactElement {
  const form = useAppForm({ defaultValues: { consent: false } });

  return (
    <form.AppForm>
      <form.AppField
        name="consent"
        validators={{ onChange: ({ value }) => (value ? undefined : { keyword: "required" }) }}
      >
        {(field) => <field.Checkbox label="I agree" />}
      </form.AppField>
    </form.AppForm>
  );
}

describe("CheckboxField", () => {
  it("writes whether the box is checked", () => {
    const { getByLabelText } = render(<Harness />);

    fireEvent.click(getByLabelText("I agree"));

    expect(getByLabelText("I agree")).toHaveProperty("checked", true);
  });

  it("shows the error once the box is touched", () => {
    const { getByLabelText, getByRole, queryByRole } = render(<Harness />);

    expect(queryByRole("alert")).toBeNull();

    fireEvent.click(getByLabelText("I agree"));
    fireEvent.click(getByLabelText("I agree"));

    expect(getByRole("alert").textContent).toBe("required");
    expect(getByLabelText("I agree").getAttribute("aria-invalid")).toBe("true");
  });
});
