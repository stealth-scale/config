import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormProvider, type Schema, translateFrom } from "@stealthscale/provider-form";

import { useAppForm, useSchemaForm } from "#hook.ts";

const signup: Schema = {
  properties: { kind: { enum: ["business", "individual"], type: "string" } },
  type: "object",
};

const KINDS = ["business", "individual"];

/**
 * Binds a select to a kind that is a business or an individual, or to a kind with the options
 * given.
 */
function Harness({
  options = KINDS,
}: {
  readonly options?: readonly string[] | undefined;
}): ReactElement {
  const form = useAppForm({ defaultValues: { kind: "" } });

  return (
    <form.AppForm>
      <form.AppField name="kind">{(field) => <field.Select options={options} />}</form.AppField>
    </form.AppForm>
  );
}

/**
 * Binds a select to a kind of a form built from the library's own options, with no options
 * stated.
 */
function Bare(): ReactElement {
  const form = useAppForm({ defaultValues: { kind: "" } });

  return (
    <form.AppForm>
      <form.AppField name="kind">{(field) => <field.Select />}</form.AppField>
    </form.AppForm>
  );
}

/**
 * Binds a select to the kind of a form built from the schema, with no options stated.
 */
function Described(): ReactElement {
  const form = useSchemaForm({ schema: signup });

  return (
    <form.AppForm>
      <form.AppField name="kind">{(field) => <field.Select />}</form.AppField>
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

  it("draws the empty choice alone where neither the caller nor a schema states any", () => {
    const { getAllByRole } = render(<Bare />);

    expect(getAllByRole("option").map((option) => option.textContent)).toStrictEqual(["Choose"]);
  });

  it("reads the choices from the schema's enum where none are stated", () => {
    const { getAllByRole } = render(<Described />);

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
