import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Schema } from "@stealthscale/provider-form";

import { useAppForm, useSchemaForm } from "#hook.ts";

const terms: Schema = {
  properties: {
    consent: {
      description: "You can withdraw it at any time",
      title: "I have read the terms",
      type: "boolean",
    },
  },
  required: ["consent"],
  type: "object",
};

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

/**
 * Binds a checkbox to the consent of a form built from the schema.
 */
function Described(): ReactElement {
  const form = useSchemaForm({ schema: terms });

  return (
    <form.AppForm>
      <form.AppField name="consent">{(field) => <field.Checkbox />}</form.AppField>
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

  it("reads the schema's title and help text and whether it requires the box", () => {
    const { getByLabelText, getByText } = render(<Described />);
    const control = getByLabelText("I have read the terms");

    expect(control.getAttribute("aria-required")).toBe("true");
    expect(control.getAttribute("aria-describedby")).toBe(
      getByText("You can withdraw it at any time").id,
    );
  });
});
