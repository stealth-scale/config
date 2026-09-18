import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAppForm } from "#hook.ts";

/**
 * Binds a number field to an amount.
 */
function Harness(): ReactElement {
  const form = useAppForm({ defaultValues: { amount: 1 } });

  return (
    <form.AppForm>
      <form.AppField name="amount">{(field) => <field.Number />}</form.AppField>
    </form.AppForm>
  );
}

describe("NumberField", () => {
  it("writes the number a person types", () => {
    const { getByLabelText } = render(<Harness />);

    fireEvent.change(getByLabelText("Amount"), { target: { value: "12" } });

    expect(getByLabelText("Amount")).toHaveProperty("value", "12");
  });

  it("writes zero when the box is emptied", () => {
    const { getByLabelText } = render(<Harness />);

    fireEvent.change(getByLabelText("Amount"), { target: { value: "" } });

    expect(getByLabelText("Amount")).toHaveProperty("value", "0");
  });
});
