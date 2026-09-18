import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAppForm, useSchemaForm } from "#hooks.fixtures.ts";
import { type Schema } from "#schema.ts";
import { useProperty } from "#use-property.ts";

const signup: Schema = {
  properties: {
    kind: { enum: ["business", "individual"], type: "string" },
    lines: { items: { properties: { amount: { type: "number" } }, required: ["amount"] } },
    name: { type: "string" },
  },
  required: ["kind"],
  type: "object",
};

/**
 * Draws the property of the field in scope as JSON.
 */
function Property(): ReactElement {
  return <output>{JSON.stringify(useProperty())}</output>;
}

/**
 * Builds a form from the schema and draws the property of the field named.
 */
function Described({ name }: { readonly name: "kind" | "lines[0].amount" | "name" }): ReactElement {
  const form = useSchemaForm({ schema: signup });

  return (
    <form.AppForm>
      <form.AppField name={name}>{() => <Property />}</form.AppField>
    </form.AppForm>
  );
}

/**
 * Builds a form from the library's own options and draws the property of its one field.
 */
function Plain(): ReactElement {
  const form = useAppForm({ defaultValues: { kind: "" } });

  return (
    <form.AppForm>
      <form.AppField name="kind">{() => <Property />}</form.AppField>
    </form.AppForm>
  );
}

describe("useProperty", () => {
  it("reads the property's schema and whether the root requires it", () => {
    const { getByRole } = render(<Described name="kind" />);

    expect(JSON.parse(getByRole("status").textContent)).toStrictEqual({
      required: true,
      schema: { enum: ["business", "individual"], type: "string" },
    });
  });

  it("reads an optional property as not required", () => {
    const { getByRole } = render(<Described name="name" />);

    expect(JSON.parse(getByRole("status").textContent)).toStrictEqual({
      required: false,
      schema: { type: "string" },
    });
  });

  it("collapses an index to read an item's property", () => {
    const { getByRole } = render(<Described name="lines[0].amount" />);

    expect(JSON.parse(getByRole("status").textContent)).toStrictEqual({
      required: true,
      schema: { type: "number" },
    });
  });

  it("reads nothing for a form built from the library's own options", () => {
    const { getByRole } = render(<Plain />);

    expect(JSON.parse(getByRole("status").textContent)).toStrictEqual({ required: false });
  });
});
