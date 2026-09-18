import { type ReactElement } from "react";

import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FormNameContext } from "@stealthscale/example-form-fields";

import { CheckoutForm } from "#checkout-form.tsx";

const done = vi.fn<(value: unknown) => void>();

/**
 * Draws the form under its identifier, with no words beyond the schema's own.
 */
function Page(): ReactElement {
  return (
    <FormNameContext value="checkout">
      <CheckoutForm onDone={done} />
    </FormNameContext>
  );
}

describe("CheckoutForm", () => {
  it("draws the VAT number for a business alone", () => {
    const { getByLabelText, queryByLabelText } = render(<Page />);

    expect(queryByLabelText("Vat")).toBeNull();

    fireEvent.change(getByLabelText("Kind"), { target: { value: "business" } });

    expect(getByLabelText("Vat")).toHaveProperty("value", "");
  });

  it("refuses an order missing what the schema requires", async () => {
    const { getAllByRole, getByRole } = render(<Page />);

    fireEvent.click(getByRole("button", { name: "Place order" }));

    await waitFor(() => {
      expect(getAllByRole("alert").length).toBeGreaterThan(3);
    });
    expect(done).not.toHaveBeenCalled();
  });
});
