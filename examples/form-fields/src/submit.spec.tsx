import { type ReactElement, type ReactNode } from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormProvider, translateFrom } from "@stealthscale/provider-form";

import { useAppForm } from "#hook.ts";

/**
 * Builds a form whose submit never finishes, with a submit button reading the words given.
 */
function Harness({ children }: { readonly children?: ReactNode }): ReactElement {
  const form = useAppForm({
    defaultValues: { name: "" },
    onSubmit: () => new Promise<void>(() => {}),
  });

  return (
    <form.AppForm>
      <form.Form>
        <form.Submit>{children}</form.Submit>
      </form.Form>
    </form.AppForm>
  );
}

describe("Submit", () => {
  it("reads Submit unless told the words", () => {
    const { getByRole, rerender } = render(<Harness />);

    expect(getByRole("button").textContent).toBe("Submit");

    rerender(<Harness>Send</Harness>);

    expect(getByRole("button").textContent).toBe("Send");
  });

  it("reads the catalogue's words for the form's submit action", () => {
    const words = translateFrom({ "form.actions.submit": "Place order" });
    const { getByRole } = render(
      <FormProvider translate={words}>
        <Harness />
      </FormProvider>,
    );

    expect(getByRole("button").textContent).toBe("Place order");
  });

  it("is disabled while the form is submitting", async () => {
    const { getByRole } = render(<Harness />);

    fireEvent.click(getByRole("button"));

    await waitFor(() => {
      expect(getByRole("button")).toHaveProperty("disabled", true);
    });
  });
});
