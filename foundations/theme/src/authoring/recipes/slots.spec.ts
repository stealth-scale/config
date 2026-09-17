import { describe, expect, expectTypeOf, it } from "vitest";

import { onSlot, slotsOf } from "#authoring/recipes/slots.ts";

describe("slotsOf", () => {
  it("states every value of an axis under the one part it styles", () => {
    expect(
      onSlot("root", { center: { alignItems: "center" }, end: { alignItems: "flex-end" } }),
    ).toStrictEqual({
      center: { root: { alignItems: "center" } },
      end: { root: { alignItems: "flex-end" } },
    });
  });

  it("types each value as the part it was lifted onto", () => {
    const lifted = onSlot("item", { wide: { gridColumn: "span 2" } });

    expectTypeOf(lifted.wide).toHaveProperty("item");

    expect(Object.keys(lifted)).toStrictEqual(["wide"]);
  });

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
