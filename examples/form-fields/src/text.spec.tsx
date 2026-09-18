import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Schema } from "@stealthscale/provider-form";

import { useAppForm, useSchemaForm } from "#hook.ts";

const signup: Schema = {
  properties: {
    email: { format: "email", type: "string" },
    name: { type: "string" },
    password: { format: "password", type: "string" },
  },
  type: "object",
};

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

/**
 * Binds a text field to each property of the signup schema.
 */
function Described(): ReactElement {
  const form = useSchemaForm({ schema: signup });

  return (
    <form.AppForm>
      <form.AppField name="email">{(field) => <field.Text />}</form.AppField>
      <form.AppField name="name">{(field) => <field.Text />}</form.AppField>
      <form.AppField name="password">{(field) => <field.Text />}</form.AppField>
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

  it("draws the kind the schema's format names", () => {
    const { getByLabelText } = render(<Described />);

    expect(getByLabelText("Email").getAttribute("type")).toBe("email");
    expect(getByLabelText("Name").getAttribute("type")).toBe("text");
    expect(getByLabelText("Password").getAttribute("type")).toBe("password");
  });
});
