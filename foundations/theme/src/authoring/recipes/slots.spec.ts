import { describe, expect, expectTypeOf, it } from "vitest";

import { onSlot, onSlots, slotsOf } from "#authoring/recipes/slots.ts";

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

describe("onSlots", () => {
  it("turns a scale per part into a step holding every part", () => {
    expect(
      onSlots({
        root: { md: { padding: "inset.md" }, sm: { padding: "inset.sm" } },
        title: { md: { textStyle: "heading.md" }, sm: { textStyle: "heading.sm" } },
      }),
    ).toStrictEqual({
      md: { root: { padding: "inset.md" }, title: { textStyle: "heading.md" } },
      sm: { root: { padding: "inset.sm" }, title: { textStyle: "heading.sm" } },
    });
  });

  it("leaves a part out of a step it states no styles for", () => {
    expect(
      onSlots({
        mark: { md: { boxSize: "icon.md" } },
        root: { lg: { padding: "inset.lg" }, md: { padding: "inset.md" } },
      }),
    ).toStrictEqual({
      lg: { root: { padding: "inset.lg" } },
      md: { mark: { boxSize: "icon.md" }, root: { padding: "inset.md" } },
    });
  });

  it("answers nothing where it is given no parts", () => {
    expect(onSlots({})).toStrictEqual({});
  });

  it("answers nothing where every part states no step", () => {
    expect(onSlots({ root: {} })).toStrictEqual({});
  });
});
