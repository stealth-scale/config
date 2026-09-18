import { Profiler, type ReactElement } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAppForm, useSchemaForm } from "#hooks.fixtures.ts";
import { type Schema } from "#schema.ts";
import { useResolved } from "#use-resolved.ts";

const signup: Schema = {
  allOf: [
    {
      if: { properties: { kind: { const: "business" } }, required: ["kind"] },
      // eslint-disable-next-line unicorn/no-thenable -- then is the JSON Schema keyword, and no promise reads it
      then: { properties: { vat: { type: "string" } }, required: ["vat"] },
    },
  ],
  properties: { kind: { type: "string" }, name: { type: "string" } },
  type: "object",
};

/**
 * Counts how often the reader rendered, reset by each case.
 */
const counted = { renders: 0 };

/**
 * Draws the required list of the resolved schema.
 */
function Resolved(): ReactElement {
  const resolved = useResolved();

  return <output>{JSON.stringify(resolved["required"])}</output>;
}

/**
 * Builds a form from the schema with its two fields drawn by hand, counting the reader's renders.
 */
function Page(): ReactElement {
  const form = useSchemaForm({ schema: signup });

  return (
    <form.AppForm>
      <form.AppField name="kind">{(field) => <field.Text />}</form.AppField>
      <form.AppField name="name">{(field) => <field.Text />}</form.AppField>
      <Profiler
        id="resolved"
        onRender={() => {
          counted.renders += 1;
        }}
      >
        <Resolved />
      </Profiler>
    </form.AppForm>
  );
}

/**
 * Builds a form from the library's own options and reads the resolved schema under it.
 */
function Plain(): ReactElement {
  const form = useAppForm({ defaultValues: { name: "" } });

  return (
    <form.AppForm>
      <Resolved />
    </form.AppForm>
  );
}

describe("useResolved", () => {
  it("resolves the schema against the values in hand", () => {
    counted.renders = 0;

    const { getByLabelText, getByRole } = render(<Page />);

    expect(getByRole("status").textContent).toBe("");

    fireEvent.change(getByLabelText("Kind"), { target: { value: "business" } });

    expect(getByRole("status").textContent).toBe('["vat"]');
    expect(counted.renders).toBe(2);
  });

  it("re-renders the reader only where the resolved schema changed", () => {
    counted.renders = 0;

    const { getByLabelText } = render(<Page />);

    fireEvent.change(getByLabelText("Name"), { target: { value: "Roy" } });
    fireEvent.change(getByLabelText("Name"), { target: { value: "Roy K" } });

    expect(counted.renders).toBe(1);
  });

  it("throws when the form was not built from a schema", () => {
    expect(() => render(<Plain />)).toThrow(/useSchemaForm/u);
  });
});
