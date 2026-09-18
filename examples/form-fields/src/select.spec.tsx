import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormProvider, translateFrom } from "@stealthscale/provider-form";

import { useAppForm } from "#hook.ts";

/**
 * Binds a select to a kind that is a business or an individual.
 */
function Harness(): ReactElement {
  const form = useAppForm({ defaultValues: { kind: "" } });

  return (
    <form.AppForm>
      <form.AppField name="kind">
        {(field) => <field.Select options={["business", "individual"]} />}
      </form.AppField>
    </form.AppForm>
  );
}

describe("SelectField", () => {
  it("draws an empty choice and then every option", () => {
    const { getAllByRole } = render(<Harness />);

    expect(getAllByRole("option").map((option) => option.textContent)).toStrictEqual([
      "Choose",
      "business",
      "individual",
    ]);
  });

  it("reads the words of a choice and of the empty choice from the catalogue", () => {
    const words = translateFrom({
      "form.fields.kind.options.business": "A business",
      "form.fields.kind.placeholder": "Pick one",
    });
    const { getByRole } = render(
      <FormProvider translate={words}>
        <Harness />
      </FormProvider>,
    );

    expect(getByRole("option", { name: "A business" })).toHaveProperty("value", "business");
    expect(getByRole("option", { name: "Pick one" })).toHaveProperty("value", "");
  });

  it("writes the choice a person picks", () => {
    const { getByLabelText } = render(<Harness />);

    fireEvent.change(getByLabelText("Kind"), { target: { value: "individual" } });

    expect(getByLabelText("Kind")).toHaveProperty("value", "individual");
  });
});
