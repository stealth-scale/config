import { FormApi } from "@tanstack/react-form";
import { describe, expect, it, vi } from "vitest";

import { defaultEngine } from "#engine.ts";
import { layouts } from "#hooks.fixtures.ts";
import { describedForm, describeForm, descriptionOf, type FormDescription } from "#registry.ts";
import { untranslated } from "#translate.ts";

const description: FormDescription = {
  draft: { clear: vi.fn<() => void>(), restored: undefined, write: vi.fn<() => void>() },
  engine: defaultEngine(),
  fieldOptions: {},
  id: "checkout",
  layouts,
  presentation: { id: "checkout" },
  renderers: [],
  schema: { type: "object" },
  translate: untranslated,
};

describe("describeForm", () => {
  it("keeps the description under the form's store", () => {
    const form = new FormApi({ defaultValues: { name: "" } });

    describeForm(form, description);

    expect(descriptionOf(form)).toBe(description);
    expect(descriptionOf({ baseStore: form.baseStore })).toBe(description);
  });

  it("keeps one form's description apart from another's", () => {
    const one = new FormApi({ defaultValues: { name: "" } });
    const other = new FormApi({ defaultValues: { name: "" } });

    describeForm(one, description);

    expect(descriptionOf(other)).toBeUndefined();
  });
});

describe("describedForm", () => {
  it("returns the description of a form built from a schema", () => {
    const form = new FormApi({ defaultValues: { name: "" } });

    describeForm(form, description);

    expect(describedForm(form)).toBe(description);
  });

  it("throws when the form was not built from a schema", () => {
    expect(() => describedForm(new FormApi({ defaultValues: {} }))).toThrow(/useSchemaForm/u);
  });
});
