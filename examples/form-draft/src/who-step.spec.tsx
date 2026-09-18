import { type ReactElement } from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FormNameContext, useAppForm } from "@stealthscale/example-form-fields";
import { FormProvider } from "@stealthscale/provider-form";

import { profileOptions } from "#options.ts";
import { type ProfileValues } from "#schema.ts";
import { WhoStep } from "#who-step.tsx";
import { words } from "#words.ts";

const left = vi.fn<() => void>();

/**
 * Owns a form starting from the values given and draws the first step over it.
 */
function Owner({ values }: { readonly values: ProfileValues }): ReactElement {
  const form = useAppForm({ ...profileOptions, defaultValues: values });

  return (
    <FormProvider translate={words}>
      <FormNameContext value="profile">
        <form.AppForm>
          <form.Form>
            <WhoStep form={form} onNext={left} />
          </form.Form>
        </form.AppForm>
      </FormNameContext>
    </FormProvider>
  );
}

/**
 * Builds values every rule accepts.
 */
function passing(): ProfileValues {
  return { bio: "", email: "roy@example.com", name: "Roy", newPassword: "" };
}

describe("WhoStep", () => {
  it("refuses to leave while a field of the step is refused", async () => {
    const { getByLabelText, getByRole } = render(<Owner values={{ ...passing(), name: "R" }} />);

    fireEvent.click(getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(getByRole("alert").textContent).toBe("Enter at least two characters");
    });
    expect(document.activeElement).toBe(getByLabelText("Name"));
    expect(left).not.toHaveBeenCalled();
  });

  it("leaves once every field of the step passes", async () => {
    const { getByRole } = render(<Owner values={passing()} />);

    fireEvent.click(getByRole("button", { name: "Next" }));

    await waitFor(() => {
      expect(left).toHaveBeenCalledTimes(1);
    });
  });
});
