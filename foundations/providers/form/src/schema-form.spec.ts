import { describe, expect, expectTypeOf, it } from "vitest";

import {
  type DraftScope,
  type FieldOptionsByPath,
  type SchemaValidators,
  type UseSchemaFormOptions,
} from "#schema-form.ts";

interface Signup {
  lines: Array<{ amount: number }>;
  name: string;
}

describe("UseSchemaFormOptions", () => {
  it("takes the schema and everything else as an override", () => {
    const options: UseSchemaFormOptions<Signup> = { schema: { type: "object" } };

    expectTypeOf<UseSchemaFormOptions<Signup>>().toHaveProperty("schema");
    expectTypeOf<UseSchemaFormOptions<Signup>>().toHaveProperty("onSubmitMeta");
    expectTypeOf<UseSchemaFormOptions<Signup>>().not.toHaveProperty("defaultValues");
    expectTypeOf<DraftScope>().toHaveProperty("app");
    expectTypeOf<SchemaValidators<Signup>>().not.toHaveProperty("onDynamic");

    expect(Object.keys(options)).toStrictEqual(["schema"]);
  });

  it("types a field's options over the value at its path", () => {
    const trimmed: string[] = [];
    const options: FieldOptionsByPath<Signup> = {
      "lines[].amount": {
        validators: { onChange: ({ value }) => (value > 0 ? undefined : "positive") },
      },
      name: {
        listeners: {
          onChange: ({ value }) => {
            trimmed.push(value.trim());
          },
        },
        validators: { onBlur: ({ value }) => (value.length > 1 ? undefined : "short") },
      },
    };

    expectTypeOf<FieldOptionsByPath<Signup>>().toHaveProperty("name");
    expectTypeOf<FieldOptionsByPath<Signup>>().toHaveProperty("lines[].amount");
    expectTypeOf<FieldOptionsByPath<Signup>>().not.toHaveProperty("gone");

    expect(Object.keys(options)).toStrictEqual(["lines[].amount", "name"]);
  });
});
