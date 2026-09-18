import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAppForm, withFieldGroup, withForm } from "#hook.ts";

/**
 * Draws one field of each kind and the two form components.
 */
function Harness(): ReactElement {
  const form = useAppForm({
    defaultValues: { amount: 1, consent: false, kind: "", name: "" },
  });

  return (
    <form.AppForm>
      <form.Form>
        <form.AppField name="name">{(field) => <field.Text />}</form.AppField>
        <form.AppField name="amount">{(field) => <field.Number />}</form.AppField>
        <form.AppField name="kind">{(field) => <field.Select options={["a"]} />}</form.AppField>
        <form.AppField name="consent">{(field) => <field.Checkbox />}</form.AppField>
        <form.Submit />
      </form.Form>
    </form.AppForm>
  );
}

describe("useAppForm", () => {
  it("binds the four field components and the two form components", () => {
    const { getByLabelText, getByRole } = render(<Harness />);

    expect(getByLabelText("Name").getAttribute("type")).toBe("text");
    expect(getByLabelText("Amount").getAttribute("type")).toBe("number");
    expect(getByLabelText("Kind").tagName).toBe("SELECT");
    expect(getByLabelText("Consent").getAttribute("type")).toBe("checkbox");
    expect(getByRole("button").textContent).toBe("Submit");
  });
});

/**
 * Draws the name of a form handed to it.
 */
const Section = withForm({
  defaultValues: { name: "" },
  render: ({ form }) => <form.AppField name="name">{(field) => <field.Text />}</form.AppField>,
});

/**
 * Owns a form and hands it to the section.
 */
function SectionOwner(): ReactElement {
  const form = useAppForm({ defaultValues: { name: "Roy" } });

  return <Section form={form} />;
}

/**
 * Draws a city under whatever prefix it is mounted at.
 */
const Address = withFieldGroup({
  defaultValues: { city: "" },
  render: ({ group }) => <group.AppField name="city">{(field) => <field.Text />}</group.AppField>,
});

/**
 * Owns a form and mounts the group under its billing address.
 */
function GroupOwner(): ReactElement {
  const form = useAppForm({ defaultValues: { billing: { city: "Delft" } } });

  return <Address fields="billing" form={form} />;
}

describe("withForm", () => {
  it("answers a component that draws a form handed to it", () => {
    expect(render(<SectionOwner />).getByLabelText("Name")).toHaveProperty("value", "Roy");
  });
});

describe("withFieldGroup", () => {
  it("answers a component that draws a group of fields at a prefix", () => {
    expect(render(<GroupOwner />).getByLabelText("City")).toHaveProperty("value", "Delft");
  });
});
