import { fireEvent, render, type RenderResult, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { App } from "#app.tsx";

/**
 * Fills every field the schema requires of an individual.
 */
function fill({ getByLabelText }: RenderResult): void {
  fireEvent.change(getByLabelText("Full name"), { target: { value: "Roy" } });
  fireEvent.change(getByLabelText("Email"), { target: { value: "roy@example.com" } });
  fireEvent.change(getByLabelText("Kind"), { target: { value: "individual" } });
  fireEvent.change(getByLabelText("Address"), { target: { value: "Main street 1" } });
  fireEvent.change(getByLabelText("Postcode"), { target: { value: "2611" } });
  fireEvent.change(getByLabelText("City"), { target: { value: "Delft" } });
  fireEvent.change(getByLabelText("Country"), { target: { value: "NL" } });
  fireEvent.change(getByLabelText("Description"), { target: { value: "Design" } });
  fireEvent.change(getByLabelText("Amount"), { target: { value: "120" } });
}

describe("App", () => {
  it("draws the fieldsets in the order the schema states with their legends", () => {
    const { getAllByRole } = render(<App />);

    expect(
      getAllByRole("group").map((group) => group.querySelector("legend")?.textContent),
    ).toStrictEqual(["Who is ordering", "Billing address", "Lines"]);
  });

  it("picks the control for each field from the renderers", () => {
    const { getByLabelText, getByText } = render(<App />);

    expect(getByLabelText("Email").getAttribute("type")).toBe("email");
    expect(getByLabelText("Country").tagName).toBe("SELECT");
    expect(getByLabelText("Notes").tagName).toBe("TEXTAREA");
    expect(getByText("EUR").tagName).toBe("SPAN");
    expect(getByLabelText("City").parentElement?.parentElement?.className).toBe("span-2");
  });

  it("draws the VAT number for a business alone", () => {
    const { getByLabelText, queryByLabelText } = render(<App />);

    expect(queryByLabelText("VAT number")).toBeNull();

    fireEvent.change(getByLabelText("Kind"), { target: { value: "business" } });

    expect(getByLabelText("VAT number").getAttribute("name")).toBe("vat");
  });

  it("adds and removes a line", () => {
    const { getAllByLabelText, getAllByRole, getByRole } = render(<App />);

    expect(getAllByLabelText("Description")).toHaveLength(1);

    fireEvent.click(getByRole("button", { name: "Add" }));

    expect(getAllByLabelText("Description")).toHaveLength(2);

    fireEvent.click(getAllByRole("button", { name: "Remove" })[1] ?? document.body);

    expect(getAllByLabelText("Description")).toHaveLength(1);
  });

  it("lists the field nobody placed and every message the form reads", () => {
    const { getByRole, getByText } = render(<App />);

    expect(getByRole("listitem").textContent).toBe("reference");
    expect(getByText("checkout.fields.billing.city.label").tagName).toBe("TD");
    expect(getByText("checkout.groups.who.legend").tagName).toBe("TD");
  });

  it("shows a refusal in a line under the shared words", async () => {
    const page = render(<App />);

    fill(page);
    fireEvent.change(page.getByLabelText("Amount"), { target: { value: "0" } });
    fireEvent.click(page.getByRole("button", { name: "Place order" }));

    await waitFor(() => {
      expect(page.getAllByRole("alert").map((alert) => alert.textContent)).toContain(
        "At least one",
      );
    });
  });

  it("submits the values once the schema accepts them", async () => {
    const page = render(<App />);

    fill(page);
    fireEvent.click(page.getByRole("button", { name: "Place order" }));

    await waitFor(() => {
      expect(page.getByRole("status").textContent).toContain('"amount": 120');
    });
  });
});
