import { type ReactElement } from "react";

import { fireEvent, render, type RenderResult, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FormProvider, translateFrom } from "@stealthscale/provider-form";

import { ContactForm } from "#contact-form.tsx";
import { type Contact } from "#schema.ts";
import { catalogues } from "#words.ts";

const sent = vi.fn<(value: Contact) => void>();

/**
 * Draws the form under the English catalogue.
 */
function Page(): ReactElement {
  return (
    <FormProvider translate={translateFrom(catalogues.en)}>
      <ContactForm onSent={sent} />
    </FormProvider>
  );
}

/**
 * Fills every field of the form with a value the schema accepts.
 */
function fill({ getByLabelText }: RenderResult): void {
  fireEvent.change(getByLabelText("Your name"), { target: { value: "Roy" } });
  fireEvent.change(getByLabelText("Email address"), { target: { value: "roy@example.com" } });
  fireEvent.change(getByLabelText("Topic"), { target: { value: "sales" } });
  fireEvent.click(getByLabelText("I agree to be contacted"));
}

describe("ContactForm", () => {
  it("draws the two fieldsets the schema states with no choice made", () => {
    const { getAllByRole, getByLabelText } = render(<Page />);

    expect(
      getAllByRole("group").map((group) => group.querySelector("legend")?.textContent),
    ).toStrictEqual(["Who you are", "What you need"]);
    expect(getByLabelText("Topic")).toHaveProperty("value", "");
    expect(getByLabelText("I agree to be contacted")).toHaveProperty("checked", false);
  });

  it("shows the schema's refusals in the catalogue's words after a submit", async () => {
    const page = render(<Page />);

    fireEvent.click(page.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      const refusals = page
        .getAllByRole("alert")
        .map((alert) => alert.textContent)
        .filter((words) => words !== "");

      expect(refusals).toStrictEqual([
        "Enter at least 2 characters",
        "Enter your email address",
        "Pick a topic",
        "Tick the box to continue",
      ]);
    });
    expect(document.activeElement).toHaveProperty("name", "name");
  });

  it("reads a refusal the whole product shares where the form has no words of its own", async () => {
    const page = render(<Page />);

    fill(page);
    fireEvent.change(page.getByLabelText("Email address"), { target: { value: "nobody" } });
    fireEvent.click(page.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(page.getAllByRole("alert").map((alert) => alert.textContent)).toContain(
        "Enter an address like name@example.com",
      );
    });
  });

  it("hands the values over once they pass", async () => {
    const page = render(<Page />);

    fill(page);
    fireEvent.click(page.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(sent).toHaveBeenCalledWith({
        consent: true,
        email: "roy@example.com",
        message: "",
        name: "Roy",
        topic: "sales",
      });
    });
  });
});
