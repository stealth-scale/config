import { FieldApi, FormApi } from "@tanstack/react-form";
import { describe, expect, it } from "vitest";

import { formDefaults } from "#form-defaults.ts";
import { type Schema } from "#schema.ts";
import { standardOf } from "#standard.ts";

interface Invoice {
  customer: { email: string };
  lines: Array<{ amount: number }>;
  note: string;
}

const invoice: Schema = {
  properties: {
    customer: {
      properties: { email: { format: "email", type: "string" } },
      required: ["email"],
      type: "object",
    },
    lines: {
      items: { properties: { amount: { minimum: 1, type: "number" } }, type: "object" },
      type: "array",
    },
    note: { maxLength: 3, type: "string" },
  },
  type: "object",
};

const defaultValues: Invoice = { customer: { email: "" }, lines: [{ amount: 0 }], note: "long" };

/**
 * Waits for the asynchronous slots to settle.
 */
function settled(): Promise<void> {
  return new Promise((resolve): void => {
    setTimeout(resolve, 30);
  });
}

describe("standardOf", () => {
  it("answers the value where it passes and the issues where it does not", () => {
    const schema = standardOf<Invoice>(invoice);
    const good: Invoice = { customer: { email: "roy@example.com" }, lines: [], note: "ok" };

    expect(schema["~standard"].validate(good)).toStrictEqual({ value: good });
    expect(schema["~standard"].validate({ ...good, note: "long" })).toStrictEqual({
      issues: [expect.objectContaining({ keyword: "maxLength", path: ["note"] })],
    });
  });

  it("puts each issue on the field at its path when a form validates", async () => {
    const form = new FormApi({
      ...formDefaults,
      defaultValues,
      validators: { onDynamic: standardOf<Invoice>(invoice) },
    });

    form.mount();
    new FieldApi({ form, name: "lines[0].amount" }).mount();
    await form.handleSubmit();

    expect(form.getFieldMeta("lines[0].amount")?.errors).toStrictEqual([
      expect.objectContaining({ keyword: "minimum", path: ["lines", 0, "amount"] }),
    ]);
    expect(form.getFieldMeta("note")?.errors).toStrictEqual([
      expect.objectContaining({ keyword: "maxLength", path: ["note"] }),
    ]);
    expect(form.state.isValid).toBe(false);
  });

  it("keeps an issue at the root under the empty name", async () => {
    const empty: Record<string, never> = {};
    const form = new FormApi({
      ...formDefaults,
      defaultValues: empty,
      validators: { onDynamic: standardOf<Record<string, never>>({ type: "string" }) },
    });

    form.mount();
    await form.handleSubmit();

    expect(form.state.errorMap.onDynamic).toStrictEqual({
      "": [expect.objectContaining({ keyword: "type", path: [] })],
    });
  });

  it("runs over a field's own value in a field slot", () => {
    const form = new FormApi({ ...formDefaults, defaultValues });
    const note = new FieldApi({
      form,
      name: "note",
      validators: { onChange: standardOf<string>({ maxLength: 3, type: "string" }) },
    });

    form.mount();
    note.mount();
    note.setValue("long");

    expect(note.state.meta.errors).toStrictEqual([
      expect.objectContaining({ keyword: "maxLength", path: [] }),
    ]);
  });

  it("stops a field's asynchronous check where the schema refused the field", async () => {
    const asked: string[] = [];
    const form = new FormApi({
      ...formDefaults,
      defaultValues,
      validators: { onDynamic: standardOf<Invoice>(invoice) },
    });

    form.mount();
    new FieldApi({
      form,
      name: "customer.email",
      validators: {
        onChangeAsync: ({ value }): void => {
          asked.push(value);
        },
      },
    }).mount();
    await form.handleSubmit();
    form.setFieldValue("customer.email", "still bad");
    await settled();
    form.setFieldValue("customer.email", "roy@example.com");
    await settled();

    expect(asked).toStrictEqual(["", "roy@example.com"]);
  });

  it("throws when the schema names a format nobody registered", () => {
    expect(() => standardOf({ format: "nobody", type: "string" })).toThrow(/"nobody"/u);
  });
});
