import { type ReactElement } from "react";

import { fireEvent, render, type RenderResult, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FormNameContext } from "@stealthscale/example-form-fields";
import { FormProvider } from "@stealthscale/provider-form";

import { engine } from "#engine.ts";
import { type Signup } from "#schema.ts";
import { SignupForm } from "#signup-form.tsx";
import { words } from "#words.ts";

const done = vi.fn<(value: Signup) => void>();

/**
 * Draws the form under the page's engine, its words and its identifier.
 */
function Page(): ReactElement {
  return (
    <FormProvider engine={engine} translate={words}>
      <FormNameContext value="signup">
        <SignupForm onDone={done} />
      </FormNameContext>
    </FormProvider>
  );
}

/**
 * Fills the form as an individual with values every rule accepts.
 */
function fill({ getByLabelText }: RenderResult): void {
  fireEvent.change(getByLabelText("Account"), { target: { value: "individual" } });
  fireEvent.change(getByLabelText("Username"), { target: { value: "ann" } });
  fireEvent.change(getByLabelText("Password"), { target: { value: "hunter22hunter" } });
  fireEvent.change(getByLabelText("Password again"), { target: { value: "hunter22hunter" } });
}

/**
 * Submits the form.
 */
function submit({ getByRole }: RenderResult): void {
  fireEvent.click(getByRole("button", { name: "Sign up" }));
}

describe("SignupForm", () => {
  it("draws the VAT field for a business alone", () => {
    const page = render(<Page />);

    expect(page.queryByLabelText("VAT number")).toBeNull();

    fireEvent.change(page.getByLabelText("Account"), { target: { value: "business" } });

    expect(page.getByLabelText("VAT number").getAttribute("name")).toBe("vat");
  });

  it("refuses a VAT number the registered format does not accept", async () => {
    const page = render(<Page />);

    fill(page);
    fireEvent.change(page.getByLabelText("Account"), { target: { value: "business" } });
    fireEvent.change(page.getByLabelText("VAT number"), { target: { value: "nl" } });
    submit(page);

    await waitFor(() => {
      expect(page.getByRole("alert").textContent).toBe("Enter a VAT number like NL123456789B01");
    });
  });

  it("refuses a confirmation that differs under the registered keyword", async () => {
    const page = render(<Page />);

    fill(page);
    fireEvent.change(page.getByLabelText("Password again"), { target: { value: "other" } });
    submit(page);

    await waitFor(() => {
      expect(page.getByRole("alert").textContent).toBe("The passwords differ");
    });
  });

  it("asks the accounts service on blur and shows a taken name", async () => {
    const page = render(<Page />);

    fireEvent.change(page.getByLabelText("Username"), { target: { value: "roy" } });
    fireEvent.blur(page.getByLabelText("Username"));

    await waitFor(() => {
      expect(page.getByRole("alert").textContent).toBe("That name is taken");
    });
  });

  it("refuses a password holding the username through the form validator", async () => {
    const page = render(<Page />);

    fill(page);
    fireEvent.change(page.getByLabelText("Password"), { target: { value: "ann12345678" } });
    fireEvent.change(page.getByLabelText("Password again"), { target: { value: "ann12345678" } });
    submit(page);

    await waitFor(() => {
      expect(page.getByRole("alert").textContent).toBe("Do not put your name in your password");
    });
  });

  it("hands the values over once every rule passes", async () => {
    const page = render(<Page />);

    fill(page);
    submit(page);

    await waitFor(() => {
      expect(done).toHaveBeenCalledWith({
        confirm: "hunter22hunter",
        kind: "individual",
        password: "hunter22hunter",
        username: "ann",
        vat: "",
      });
    });
  });
});
