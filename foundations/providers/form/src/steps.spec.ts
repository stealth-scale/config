import { FieldApi, FormApi } from "@tanstack/react-form";
import { describe, expect, it } from "vitest";

import { leaveStep, type Steppable } from "#steps.ts";

/**
 * Describes a form the specification drives, with how often its form-level validator ran.
 */
interface Driven {
  readonly form: Steppable;
  readonly runs: () => number;
}

/**
 * Builds a form with two mounted fields whose controls are in the document, refusing the fields
 * named at the form level on submit.
 */
function mounted(refusing: readonly string[]): Driven {
  let runs = 0;
  const form = new FormApi({
    defaultValues: { email: "", name: "" },
    validators: {
      onSubmit: (): { fields: Record<string, string> } => {
        runs += 1;

        return { fields: Object.fromEntries(refusing.map((field) => [field, "refused"])) };
      },
    },
  });

  form.mount();

  for (const name of ["email", "name"] as const) {
    new FieldApi({ form, name }).mount();

    const control = document.createElement("input");

    control.name = name;
    document.body.append(control);
  }

  return { form, runs: () => runs };
}

describe("leaveStep", () => {
  it("returns true when every field of the step passes", async () => {
    const { form, runs } = mounted([]);

    await expect(leaveStep(form, ["name", "email"])).resolves.toBe(true);
    expect(runs()).toBe(1);
  });

  it("marks every field of the step touched", async () => {
    const { form } = mounted([]);

    await leaveStep(form, ["name", "email"]);

    expect(form.getFieldMeta("name")?.isTouched).toBe(true);
    expect(form.getFieldMeta("email")?.isTouched).toBe(true);
  });

  it("returns false and moves focus to the refused field when one is refused", async () => {
    const { form, runs } = mounted(["email"]);

    await expect(leaveStep(form, ["name", "email"])).resolves.toBe(false);
    expect(runs()).toBe(1);
    expect(document.activeElement).toHaveProperty("name", "email");
  });

  it("skips a field of the step that is not mounted", async () => {
    const { form } = mounted([]);

    await expect(leaveStep(form, ["vat", "name"])).resolves.toBe(true);
    expect(form.getFieldMeta("vat")).toBeUndefined();
  });

  it("returns true without validating when no field of the step is mounted", async () => {
    const { form, runs } = mounted(["email"]);

    await expect(leaveStep(form, ["vat"])).resolves.toBe(true);
    expect(runs()).toBe(0);
  });
});
