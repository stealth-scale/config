import { type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FieldMember } from "#field-member.tsx";
import { useSchemaForm } from "#hooks.fixtures.ts";
import { type FieldOptionsByPath } from "#schema-form.ts";
import { type Schema } from "#schema.ts";

const signup: Schema = {
  allOf: [
    {
      if: { properties: { kind: { const: "business" } }, required: ["kind"] },
      // eslint-disable-next-line unicorn/no-thenable -- then is the JSON Schema keyword, and no promise reads it
      then: { properties: { vat: { default: "NL", type: "string" } }, required: ["vat"] },
    },
  ],
  properties: {
    kind: { type: "string" },
    name: { title: "Full name", type: "string", "x-span": 2 },
    tags: { items: { type: "string" }, type: "array" },
  },
  required: ["name"],
  type: "object",
};

/**
 * The schema as it resolves for a business, which requires the VAT number.
 */
const business: Schema = {
  properties: {
    kind: { type: "string" },
    name: { title: "Full name", type: "string", "x-span": 2 },
    tags: { items: { type: "string" }, type: "array" },
    vat: { default: "NL", type: "string" },
  },
  required: ["name", "vat"],
  type: "object",
};

/**
 * Builds a form from the schema and draws one member of it over the resolved schema given.
 */
function Page({
  fieldOptions,
  path,
  resolved = signup,
}: {
  readonly fieldOptions?: FieldOptionsByPath<Record<string, unknown>> | undefined;
  readonly path: string;
  readonly resolved?: Schema | undefined;
}): ReactElement {
  const form = useSchemaForm({ fieldOptions, schema: signup, values: { name: "Roy" } });

  return (
    <form.AppForm>
      <FieldMember indices={[]} path={path} resolved={resolved} />
    </form.AppForm>
  );
}

describe("FieldMember", () => {
  it("draws the field through the renderer that suits it with the value the form holds", () => {
    const { getByLabelText } = render(<Page path="name" />);

    expect(getByLabelText("Full name")).toHaveProperty("value", "Roy");
    expect(getByLabelText("Full name").getAttribute("aria-required")).toBe("true");
  });

  it("wraps the field in the cell layout with its span", () => {
    const { container } = render(<Page path="name" />);

    expect(container.querySelector(".span-2 input")).not.toBeNull();
  });

  it("draws nothing for a member the resolved schema lacks", () => {
    const { container } = render(<Page path="vat" />);

    expect(container.querySelector("input")).toBeNull();
  });

  it("draws nothing for a member no renderer suits", () => {
    const { container } = render(<Page path="tags" />);

    expect(container.querySelector("input")).toBeNull();
  });

  it("starts a field the values have no value for from the property's default", () => {
    const { getByLabelText } = render(<Page path="vat" resolved={business} />);

    expect(getByLabelText("Vat")).toHaveProperty("value", "NL");
    expect(getByLabelText("Vat").getAttribute("aria-required")).toBe("true");
  });

  it("writes the field options given for the path onto the field", () => {
    const seen: unknown[] = [];
    const fieldOptions: FieldOptionsByPath<Record<string, unknown>> = {
      name: {
        listeners: {
          onChange: ({ value }) => {
            seen.push(value);
          },
        },
        validators: { onChange: ({ value }) => (value === "x" ? { keyword: "taken" } : undefined) },
      },
    };
    const { getByLabelText, getByRole } = render(<Page fieldOptions={fieldOptions} path="name" />);

    fireEvent.change(getByLabelText("Full name"), { target: { value: "x" } });

    expect(getByRole("alert").textContent).toBe("taken");
    expect(seen).toStrictEqual(["x"]);
  });
});
