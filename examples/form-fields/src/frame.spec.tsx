import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormProvider, translateFrom } from "@stealthscale/provider-form";

import { Frame } from "#frame.tsx";
import { useAppForm } from "#hook.ts";

/**
 * Frames a text box bound to an email field that refuses an empty value on blur.
 */
function Harness({ label }: { readonly label?: string | undefined }): ReactElement {
  const form = useAppForm({ defaultValues: { email: "" } });

  return (
    <form.AppForm>
      <form.AppField
        name="email"
        validators={{
          onBlur: ({ value }) =>
            value === "" ? { keyword: "required", message: "Enter it" } : undefined,
        }}
      >
        {(field) => (
          <Frame label={label}>
            {(control) => (
              <input
                {...control}
                onBlur={field.handleBlur}
                onChange={(event) => {
                  field.handleChange(event.target.value);
                }}
                value={field.state.value}
              />
            )}
          </Frame>
        )}
      </form.AppField>
    </form.AppForm>
  );
}

describe("Frame", () => {
  it("ties the label to the control and the control to its help and error", () => {
    const { getByLabelText } = render(<Harness />);
    const control = getByLabelText("Email");

    expect(control.getAttribute("aria-describedby")).toBe(`${control.id}-help ${control.id}-error`);
    expect(control.getAttribute("name")).toBe("email");
    expect(control.getAttribute("aria-invalid")).toBe("false");
  });

  it("shows the first error once the field is touched", () => {
    const { getByLabelText, getByRole, queryByRole } = render(<Harness />);

    expect(queryByRole("alert")).toBeNull();

    fireEvent.blur(getByLabelText("Email"));

    expect(getByRole("alert").textContent).toBe("Enter it");
    expect(getByLabelText("Email").getAttribute("aria-invalid")).toBe("true");
  });

  it("draws the help text the catalogue has for the field", () => {
    const words = translateFrom({ "form.fields.email.description": "We never share it" });
    const { getByLabelText, getByText } = render(
      <FormProvider translate={words}>
        <Harness />
      </FormProvider>,
    );

    expect(getByText("We never share it").id).toBe(`${getByLabelText("Email").id}-help`);
  });

  it("takes the label given over the path written out", () => {
    const { getByLabelText } = render(<Harness label="Your address" />);

    expect(getByLabelText("Your address").getAttribute("name")).toBe("email");
  });
});
