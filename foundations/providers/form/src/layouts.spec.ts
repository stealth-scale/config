import { describe, expect, expectTypeOf, it } from "vitest";

import { layouts } from "#hooks.fixtures.ts";
import {
  type CellProps,
  type GroupProps,
  type ItemProps,
  type Layouts,
  type StepProps,
} from "#layouts.ts";

describe("Layouts", () => {
  it("names the four components that lay a generated form out", () => {
    expectTypeOf(layouts).toExtend<Layouts>();
    expectTypeOf<CellProps>().toHaveProperty("span");
    expectTypeOf<GroupProps>().toHaveProperty("onAdd");
    expectTypeOf<ItemProps>().toHaveProperty("onRemove");
    expectTypeOf<StepProps>().toHaveProperty("onGo");

    expect(Object.keys(layouts)).toStrictEqual(["Cell", "Group", "Item", "Step"]);
  });
});
