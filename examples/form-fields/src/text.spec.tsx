import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAppForm } from "#hook.ts";

/**
 * Binds a text field to a name that has to be two characters or more.
 */
function Harness({ type }: { readonly type?: "email" | undefined }): ReactElement {
  const form = useAppForm({ defaultValues: { name: "" } });

  return (
    <form.AppForm>
      <form.AppField
        name="name"
        validators={{ onChange: ({ value }) => (value.length < 2 ? "Too short" : undefined) }}
      >
        {(field) => <field.Text type={type} />}
      </form.AppField>
    </form.AppForm>
  );
}

describe("TextField", () => {
  it("writes what a person types into the field", () => {
    const { getByLabelText } = render(<Harness />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "Roy" } });

    expect(getByLabelText("Name")).toHaveProperty("value", "Roy");
  });

  it("shows the error the validator answered", () => {
    const { getByLabelText, getByRole } = render(<Harness />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "R" } });

    expect(getByRole("alert").textContent).toBe("Too short");
  });

  it("draws a plain text box unless told the kind", () => {
    const { getByLabelText, rerender } = render(<Harness />);

    expect(getByLabelText("Name").getAttribute("type")).toBe("text");

    rerender(<Harness type="email" />);

    expect(getByLabelText("Name").getAttribute("type")).toBe("email");
  });
});
