import { describe, expect, expectTypeOf, it } from "vitest";

import { layouts } from "#hooks.fixtures.ts";
import {
  type CellProps,
  type ErrorsProps,
  type GroupProps,
  type ItemProps,
  type Layouts,
  type StepProps,
} from "#layouts.ts";

describe("Layouts", () => {
  it("names the five components that lay a generated form out", () => {
    expectTypeOf(layouts).toExtend<Layouts>();
    expectTypeOf<CellProps>().toHaveProperty("span");
    expectTypeOf<ErrorsProps>().toHaveProperty("errors");
    expectTypeOf<GroupProps>().toHaveProperty("onAdd");
    expectTypeOf<ItemProps>().toHaveProperty("onRemove");
    expectTypeOf<StepProps>().toHaveProperty("onGo");

    expect(Object.keys(layouts)).toStrictEqual(["Cell", "Errors", "Group", "Item", "Step"]);
  });

  it("gives every layout but the cell the id it writes on its root element", () => {
    expectTypeOf<ErrorsProps>().toHaveProperty("id").toEqualTypeOf<string>();
    expectTypeOf<GroupProps>().toHaveProperty("id").toEqualTypeOf<string>();
    expectTypeOf<ItemProps>().toHaveProperty("id").toEqualTypeOf<string>();
    expectTypeOf<StepProps>().toHaveProperty("id").toEqualTypeOf<string>();
    expectTypeOf<CellProps>().not.toHaveProperty("id");

    expect(Object.keys(layouts)).toHaveLength(5);
  });
});
