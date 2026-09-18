import { describe, expect, expectTypeOf, it } from "vitest";

import {
  type DraftScope,
  type SchemaValidators,
  type Submitted,
  type UseSchemaFormOptions,
} from "#schema-form.ts";

interface Signup {
  name: string;
}

describe("UseSchemaFormOptions", () => {
  it("takes the schema and everything else as an override", () => {
    const options: UseSchemaFormOptions<Signup> = { schema: { type: "object" } };

    expectTypeOf<UseSchemaFormOptions<Signup>>().toHaveProperty("schema");
    expectTypeOf<UseSchemaFormOptions<Signup>["onSubmit"]>()
      .parameter(0)
      .toEqualTypeOf<Submitted<Signup>>();
    expectTypeOf<DraftScope>().toHaveProperty("app");
    expectTypeOf<SchemaValidators<Signup>>().not.toHaveProperty("onDynamic");

    expect(Object.keys(options)).toStrictEqual(["schema"]);
  });
});
