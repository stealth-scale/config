import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CheckoutForm } from "#checkout-form.tsx";

const done = vi.fn<(value: unknown) => void>();

describe("CheckoutForm", () => {
  it("draws the VAT number for a business alone", () => {
    const { getByLabelText, queryByLabelText } = render(<CheckoutForm onDone={done} />);

    expect(queryByLabelText("Vat")).toBeNull();

    fireEvent.change(getByLabelText("Kind"), { target: { value: "business" } });

    expect(getByLabelText("Vat")).toHaveProperty("value", "");
  });

  it("refuses an order missing what the schema requires", async () => {
    const { getAllByRole, getByRole } = render(<CheckoutForm onDone={done} />);

    fireEvent.click(getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(getAllByRole("alert").length).toBeGreaterThan(3);
    });
    expect(done).not.toHaveBeenCalled();
  });
});
