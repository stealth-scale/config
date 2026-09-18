import { FieldApi, FormApi } from "@tanstack/react-form";
import { describe, expect, it } from "vitest";

import {
  errorsId,
  focusControl,
  focusFirstInvalid,
  focusInside,
  type Invalidated,
} from "#focus.ts";

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
 * named on submit and the whole form where asked.
 */
function mounted(refusing: readonly string[], whole = false): Submittable {
  const form = new FormApi({
    defaultValues: { email: "", name: "" },
    onSubmitInvalid: ({ formApi }): void => {
      focusFirstInvalid(formApi);
    },
    validators: {
      onSubmit: (): { fields: Record<string, string>; form?: string } => ({
        fields: Object.fromEntries(refusing.map((field) => [field, "refused"])),
        ...(whole && { form: "refused as a whole" }),
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

/**
 * Puts an element carrying an id in the document, holding what the caller builds inside it.
 *
 * @returns The element.
 */
function placed(
  id: string,
  inside: (element: HTMLElement) => void = (): undefined => undefined,
): HTMLElement {
  const element = document.createElement("div");

  element.id = id;
  inside(element);
  document.body.append(element);

  return element;
}

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

describe("errorsId", () => {
  it("derives the errors region's id from the form's", () => {
    expect(errorsId("f1")).toBe("f1-errors");
  });
});

describe("focusControl", () => {
  it("moves focus to the control carrying the name", () => {
    mounted([]);

    expect(focusControl("email")).toBe(true);
    expect(document.activeElement).toHaveProperty("name", "email");
  });

  it("leaves focus alone when no control carries the name", () => {
    mounted([]);
    focusControl("email");

    expect(focusControl("gone")).toBe(false);
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

  it("opens every closed disclosure around the control before it focuses", () => {
    const outer = document.createElement("details");
    const inner = document.createElement("details");
    const control = document.createElement("input");

    control.name = "hidden";
    inner.append(control);
    outer.append(inner);
    document.body.append(outer);

    focusControl("hidden");

    expect(outer.open).toBe(true);
    expect(inner.open).toBe(true);
    expect(document.activeElement).toBe(control);
  });
});

describe("focusInside", () => {
  it("moves focus to the first control inside the element carrying the id", () => {
    let first: HTMLElement | undefined;

    placed("step-1", (element) => {
      const heading = document.createElement("h2");
      const control = document.createElement("input");

      heading.tabIndex = -1;
      element.append(heading, control);
      first = heading;
    });

    expect(focusInside("step-1")).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it("moves focus to the element itself where it holds no control and can take focus", () => {
    const region = placed("errors-1");

    region.tabIndex = -1;

    expect(focusInside("errors-1")).toBe(true);
    expect(document.activeElement).toBe(region);
  });

  it("reports nothing to focus where no element carries the id", () => {
    expect(focusInside("absent")).toBe(false);
  });
});

describe("focusFirstInvalid", () => {
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

  it("focuses the refused field inside the form's own element", async () => {
    const form = mounted(["email"]);
    const inside = formed(form.formId, "email");

    await form.handleSubmit();

    expect(document.activeElement).toBe(inside);
  });

  it("moves focus to the errors region where the form was refused as a whole", async () => {
    const form = mounted([], true);
    const region = placed(errorsId(form.formId));

    region.tabIndex = -1;

    await form.handleSubmit();

    expect(document.activeElement).toBe(region);
  });

  it("leaves focus alone when no field has an error", () => {
    const form = mounted([]);
    const before = document.activeElement;

    focusFirstInvalid(form);

    expect(document.activeElement).toBe(before);
  });

  it("leaves focus alone for a form with no identifier and no refused field", () => {
    const before = document.activeElement;

    focusFirstInvalid({ state: { fieldMeta: {} } });

    expect(document.activeElement).toBe(before);
  });
});
