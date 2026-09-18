import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createEngine } from "#engine.ts";
import { formDefaults } from "#form-defaults.ts";
import { schemaFormOptions } from "#form-options.ts";
import { useSchemaForm, withForm } from "#hooks.fixtures.ts";
import { type Schema } from "#schema.ts";

interface Signup {
  name: string;
  vat: string;
}

const signup: Schema = {
  properties: { name: { default: "Roy", type: "string" }, vat: { type: "string" } },
  type: "object",
};

/**
 * Draws the name field over a form handed to it, typed by the shared options.
 */
const NamePart = withForm({
  ...schemaFormOptions<Signup>(signup),
  render: ({ form }) => <form.AppField name="name">{(field) => <field.Text />}</form.AppField>,
});

/**
 * Builds the signup form with a validator of its own and hands it to the part.
 */
function Composed(): ReactElement {
  const form = useSchemaForm<Signup>({
    schema: signup,
    validators: { onSubmit: () => {} },
    values: { name: "Roy K" },
  });

  return (
    <form.AppForm>
      <NamePart form={form} />
    </form.AppForm>
  );
}

describe("schemaFormOptions", () => {
  it("starts from the schema's defaults with the house defaults spread in", () => {
    const options = schemaFormOptions<Signup>(signup);

    expect(options.defaultValues).toStrictEqual({ name: "Roy", vat: "" });
    expect(options.onSubmitInvalid).toBe(formDefaults.onSubmitInvalid);
    expect(options.validationLogic).toBe(formDefaults.validationLogic);
  });

  it("writes the values given over the schema's defaults", () => {
    expect(
      schemaFormOptions<Signup>(signup, { values: { vat: "NL1" } }).defaultValues,
    ).toStrictEqual({ name: "Roy", vat: "NL1" });
  });

  it("puts the schema in the dynamic slot as a Standard Schema", () => {
    const { validators } = schemaFormOptions<Signup>({ ...signup, required: ["vat"] });
    const result = validators.onDynamic["~standard"].validate({ name: "Roy", vat: "" });

    expect(result).toStrictEqual({ value: { name: "Roy", vat: "" } });
    expect(validators.onDynamic["~standard"].validate({ name: "Roy" })).toHaveProperty("issues");
  });

  it("evaluates the schema with the engine given", () => {
    const vatted: Schema = { properties: { vat: { format: "vat-number", type: "string" } } };
    const engine = createEngine({
      formats: [{ holds: (value): boolean => value.startsWith("NL"), name: "vat-number" }],
    });
    const { validators } = schemaFormOptions<Signup>(vatted, { engine });

    expect(() => schemaFormOptions<Signup>(vatted)).toThrow(/vat-number/u);
    expect(validators.onDynamic["~standard"].validate({ vat: "BE1" })).toHaveProperty("issues");
  });

  it("types a part drawn with withForm so that it accepts the form the hook builds", () => {
    expect(render(<Composed />).getByLabelText("Name")).toHaveProperty("value", "Roy K");
  });
});
