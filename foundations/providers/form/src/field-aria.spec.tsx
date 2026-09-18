import { type ReactElement } from "react";

import { fireEvent, render, type RenderResult, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type FieldAria, type FieldAriaOptions, useFieldAria } from "#field-aria.ts";
import { useAppForm, useSchemaForm } from "#hooks.fixtures.ts";
import { type Presentation } from "#presentation.ts";
import { type Schema } from "#schema.ts";
import { translateFrom } from "#translate.ts";

const signup: Schema = {
  properties: {
    email: { description: "Where the receipt goes", format: "email", type: "string" },
    name: { minLength: 2, title: "Full name", type: "string" },
  },
  required: ["name"],
  type: "object",
  "x-form": { id: "signup" },
};

const words = translateFrom({
  "shared.name": "Name, shared",
  "signup.fields.email.placeholder": "you@example.com",
});

/**
 * Writes what the hook computes for the field in scope, so a case reads it back.
 */
function Probe({ options }: { readonly options?: FieldAriaOptions | undefined }): ReactElement {
  return <output>{JSON.stringify(useFieldAria(options))}</output>;
}

/**
 * Builds the signup form and hands one field to the probe.
 */
function Page({
  name,
  options,
  presentation,
}: {
  readonly name: "email" | "name";
  readonly options?: FieldAriaOptions | undefined;
  readonly presentation?: Presentation | undefined;
}): ReactElement {
  const form = useSchemaForm({ presentation, schema: signup, translate: words });

  return (
    <form.AppForm>
      <form.AppField name={name}>{() => <Probe options={options} />}</form.AppField>
    </form.AppForm>
  );
}

/**
 * Builds the signup form and draws its fields through the fixtures, which spread the wiring.
 */
function Drawn(): ReactElement {
  const form = useSchemaForm({ schema: signup, translate: words });

  return (
    <form.AppForm>
      <form.Form>
        <form.Fields />
        <form.Submit />
      </form.Form>
    </form.AppForm>
  );
}

/**
 * Builds a form from the library's options and hands one field to the probe.
 */
function Plain(): ReactElement {
  const form = useAppForm({ defaultValues: { name: "" } });

  return (
    <form.AppForm>
      <form.AppField name="name">{() => <Probe />}</form.AppField>
    </form.AppForm>
  );
}

/**
 * Reads what the probe wrote, inside the render it belongs to.
 */
function read(rendered: RenderResult): FieldAria {
  const text = within(rendered.container).getByRole("status").textContent ?? "{}";

  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the probe wrote the hook's own result
  return JSON.parse(text) as FieldAria;
}

describe("useFieldAria", () => {
  it("ties the label to the control by id", () => {
    const { control, label } = read(render(<Page name="name" />));

    expect(label.props.htmlFor).toBe(control.id);
    expect(label.text).toBe("Full name");
    expect(control.name).toBe("name");
  });

  it("names the help text in aria-describedby where the schema has one", () => {
    const { control, description } = read(render(<Page name="email" />));

    expect(description?.text).toBe("Where the receipt goes");
    expect(control["aria-describedby"]).toBe(description?.props.id);
  });

  it("names nothing in aria-describedby where the field has no help text and no error", () => {
    const { control, description, error } = read(render(<Page name="name" />));

    expect(control["aria-describedby"]).toBeUndefined();
    expect(description).toBeUndefined();
    expect(error).toBeUndefined();
  });

  it("reads required off the schema and takes the answer given over it", () => {
    expect(read(render(<Page name="name" />)).control["aria-required"]).toBe(true);
    expect(read(render(<Page name="email" />)).control["aria-required"]).toBe(false);
    expect(
      read(render(<Page name="email" options={{ required: true }} />)).control["aria-required"],
    ).toBe(true);
  });

  it("shows the error once the field is refused", async () => {
    const { getAllByRole, getByLabelText, getByRole } = render(<Drawn />);
    const control = getByLabelText("Full name");

    fireEvent.change(control, { target: { value: "R" } });
    fireEvent.click(getByRole("button"));

    await waitFor(() => {
      expect(control.getAttribute("aria-invalid")).toBe("true");
    });

    const error = getAllByRole("alert").find((alert) => alert.textContent !== "");

    expect(control.getAttribute("aria-errormessage")).toBe(error?.id);
    expect(control.getAttribute("aria-describedby")).toBe(error?.id);
  });

  it("writes the purpose and the placeholder the presentation states on the control", () => {
    const presentation: Presentation = {
      fields: { email: { autocomplete: "email", placeholder: "signup.fields.email.placeholder" } },
      id: "signup",
    };
    const { control } = read(render(<Page name="email" presentation={presentation} />));

    expect(control.autoComplete).toBe("email");
    expect(control.placeholder).toBe("you@example.com");
  });

  it("takes the words given for the label over the schema's title", () => {
    expect(read(render(<Page name="name" options={{ label: "Your name" }} />)).label.text).toBe(
      "Your name",
    );
  });

  it("reads the label under an identifier the presentation states before the derived one", () => {
    const presentation: Presentation = { fields: { name: { label: "shared.name" } }, id: "signup" };

    expect(read(render(<Page name="name" presentation={presentation} />)).label.text).toBe(
      "Name, shared",
    );
  });

  it("wires a field of a form built from the library's own options", () => {
    const { control, label } = read(render(<Plain />));

    expect(label.text).toBe("Name");
    expect(control["aria-required"]).toBe(false);
  });
});
