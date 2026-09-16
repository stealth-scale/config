import { describe, expect, expectTypeOf, it } from "vitest";

import { slotsOf } from "#authoring/recipes/slots.ts";

describe("slotsOf", () => {
  it("copies the parts of an anatomy into a slot list", () => {
    const parts = ["root", "trigger"] as const;
    const slots = slotsOf({ keys: () => parts });

    expect(slots).toStrictEqual(["root", "trigger"]);
    expect(slots).not.toBe(parts);
  });

  it("types the slots as the parts' names", () => {
    const slots = slotsOf({ keys: (): readonly ["root", "trigger"] => ["root", "trigger"] });

    expect(slots).toHaveLength(2);

    expectTypeOf(slots).toEqualTypeOf<Array<"root" | "trigger">>();
  });
});
