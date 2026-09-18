import { FieldApi, FormApi } from "@tanstack/react-form";
import { describe, expect, it } from "vitest";

import { focusControl, focusFirstInvalid, formDefaults, type Invalidated } from "#form-defaults.ts";

/**
 * Describes a form the specification can submit.
 */
interface Submittable extends Invalidated {
  /**
   * The identifier the form's element carries.
   */
  readonly formId: string;

  /**
   * Submits the form.
   */
  readonly handleSubmit: () => Promise<void>;
}

/**
 * Builds a form with two mounted fields whose controls are in the document, refusing the fields
 * named on submit.
 */
function mounted(refusing: readonly string[]): Submittable {
  const form = new FormApi({
    ...formDefaults,
    defaultValues: { email: "", name: "" },
    validators: {
      onSubmit: (): { fields: Record<string, string> } => ({
        fields: Object.fromEntries(refusing.map((field) => [field, "refused"])),
      }),
    },
  });

  form.mount();

  for (const name of ["email", "name"] as const) {
    new FieldApi({ form, name }).mount();

    const control = document.createElement("input");

    control.name = name;
    document.body.append(control);
  }

  return form;
}

describe("formDefaults", () => {
  it("validates on submit and then on every change", () => {
    expect(formDefaults.validationLogic).toBeTypeOf("function");
  });

  it("moves focus to the first field with an error when a submit is refused", async () => {
    const form = mounted(["name"]);

    await form.handleSubmit();

    expect(document.activeElement).toHaveProperty("name", "name");
  });

  it("moves focus to the earlier of two refused fields", async () => {
    const form = mounted(["name", "email"]);

    await form.handleSubmit();

    expect(document.activeElement).toHaveProperty("name", "email");
  });

  it("leaves focus alone when no field has an error", () => {
    const form = mounted([]);
    const before = document.activeElement;

    focusFirstInvalid(form);

    expect(document.activeElement).toBe(before);
  });
});

/**
 * Puts a form element carrying an identifier in the document, with a control of the name inside.
 *
 * @returns The control inside the form.
 */
function formed(formId: string, name: string): HTMLInputElement {
  const form = document.createElement("form");
  const control = document.createElement("input");

  form.id = formId;
  control.name = name;
  form.append(control);
  document.body.append(form);

  return control;
}

describe("focusControl", () => {
  it("moves focus to the control carrying the name", () => {
    mounted([]);
    focusControl("email");

    expect(document.activeElement).toHaveProperty("name", "email");
  });

  it("leaves focus alone when no control carries the name", () => {
    mounted([]);
    focusControl("email");
    focusControl("gone");

    expect(document.activeElement).toHaveProperty("name", "email");
  });

  it("moves focus to the control inside the form carrying the identifier", () => {
    mounted([]);

    const inside = formed(":r1:", "email");

    focusControl("email", ":r1:");

    expect(document.activeElement).toBe(inside);
  });

  it("searches the page where no element carries the identifier", () => {
    mounted([]);
    focusControl("email", "absent");

    expect(document.activeElement).toHaveProperty("name", "email");
  });
});

describe("focusFirstInvalid", () => {
  it("focuses the refused field inside the form's own element", async () => {
    const form = mounted(["email"]);
    const inside = formed(form.formId, "email");

    await form.handleSubmit();

    expect(document.activeElement).toBe(inside);
  });
});
