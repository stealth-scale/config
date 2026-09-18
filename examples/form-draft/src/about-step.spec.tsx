import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FormNameContext, useAppForm } from "@stealthscale/example-form-fields";
import { FormProvider } from "@stealthscale/provider-form";

import { AboutStep } from "#about-step.tsx";
import { profileOptions } from "#options.ts";
import { words } from "#words.ts";

const back = vi.fn<() => void>();

/**
 * Owns a form and draws the second step over it.
 */
function Owner(): ReactElement {
  const form = useAppForm(profileOptions);

  return (
    <FormProvider translate={words}>
      <FormNameContext value="profile">
        <form.AppForm>
          <form.Form>
            <AboutStep form={form} onBack={back} />
          </form.Form>
        </form.AppForm>
      </FormNameContext>
    </FormProvider>
  );
}

describe("AboutStep", () => {
  it("draws the bio and the password with its help text", () => {
    const { getByLabelText, getByText } = render(<Owner />);

    expect(getByLabelText("About you").getAttribute("name")).toBe("bio");
    expect(getByLabelText("New password").getAttribute("type")).toBe("password");
    expect(getByText("Leave it empty to keep your password").tagName).toBe("P");
  });

  it("tells the page when the person goes back", () => {
    const { getByRole } = render(<Owner />);

    fireEvent.click(getByRole("button", { name: "Back" }));

    expect(back).toHaveBeenCalledTimes(1);
  });
});
