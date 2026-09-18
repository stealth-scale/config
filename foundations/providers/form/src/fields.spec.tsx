import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type FieldsProps } from "#fields.tsx";
import { useAppForm, useSchemaForm } from "#hooks.fixtures.ts";
import { type Presentation } from "#presentation.ts";
import { type Schema } from "#schema.ts";

const checkout: Schema = {
  properties: {
    billing: { properties: { city: { type: "string" } }, type: "object" },
    lines: { items: { properties: { amount: { type: "number" } } }, type: "array" },
    name: { type: "string" },
  },
  type: "object",
};

/**
 * Builds a form from the schema, drawn as the presentation given, and draws its fields.
 */
function Page({
  presentation,
  ...props
}: { readonly presentation?: Presentation | undefined } & FieldsProps): ReactElement {
  const form = useSchemaForm({ presentation, schema: checkout });

  return (
    <form.AppForm>
      <form.Fields {...props} />
    </form.AppForm>
  );
}

/**
 * Builds a form from the library's own options and draws fields under it.
 */
function Plain(): ReactElement {
  const form = useAppForm({ defaultValues: { name: "" } });

  return (
    <form.AppForm>
      <form.Fields />
    </form.AppForm>
  );
}

/**
 * Lists the names of every control drawn.
 */
function named(container: HTMLElement): string[] {
  return [...container.querySelectorAll("input")].map((control) => control.name);
}

describe("Fields", () => {
  it("draws every field outside an array where the presentation states no members", () => {
    const { container } = render(<Page />);

    expect(named(container)).toStrictEqual(["billing.city", "name"]);
  });

  it("draws the presentation's members in order", () => {
    const { container } = render(
      <Page presentation={{ id: "p", of: ["name", { of: ["billing.city"] }] }} />,
    );

    expect(named(container)).toStrictEqual(["name", "billing.city"]);
  });

  it("draws the members given in place of the presentation's", () => {
    const { container } = render(<Page of={["name"]} presentation={{ id: "p", of: [] }} />);

    expect(named(container)).toStrictEqual(["name"]);
  });

  it("draws one step's members where a step is named", () => {
    const steps: Presentation = {
      id: "p",
      steps: {
        of: [
          { name: "who", of: ["name"] },
          { name: "where", of: ["billing.city"] },
        ],
      },
    };
    const { container } = render(<Page presentation={steps} step="where" />);

    expect(named(container)).toStrictEqual(["billing.city"]);
    expect(container.querySelector("h2")).toBeNull();
  });

  it("draws the steps with the controls between them where the presentation has steps", () => {
    const steps: Presentation = {
      id: "p",
      steps: {
        of: [
          { name: "who", of: ["name"] },
          { name: "where", of: ["billing.city"] },
        ],
      },
    };
    const { container, getByRole } = render(<Page presentation={steps} />);

    expect(getByRole("heading", { level: 2 }).textContent).toBe("Who");
    expect(named(container)).toStrictEqual(["name"]);
  });

  it("throws when the step named is not in the presentation", () => {
    expect(() =>
      render(<Page presentation={{ id: "p", steps: { of: [] } }} step="gone" />),
    ).toThrow(/"gone"/u);
  });

  it("throws when the form was not built from a schema", () => {
    expect(() => render(<Plain />)).toThrow(/useSchemaForm/u);
  });
});
