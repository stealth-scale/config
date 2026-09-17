import { describe, expect, it } from "vitest";

import type { ConditionalValue } from "#generated/types/system.d.mts";
import { responsive } from "#patterns/responsive.ts";

function doubled(value: number): string {
  return String(value * 2);
}

describe("responsive", () => {
  it("transforms a scalar", () => {
    expect(responsive(2, doubled)).toBe("4");
  });

  it("transforms every breakpoint of an object", () => {
    expect(responsive({ base: 1, md: 3 }, doubled)).toStrictEqual({ base: "2", md: "6" });
  });

  it("transforms every entry of an array but a null", () => {
    expect(responsive([1, null, 3], doubled)).toStrictEqual(["2", null, "6"]);
  });

  it("drops a breakpoint whose value is undefined", () => {
    const stated = { base: 1, md: undefined } as unknown as ConditionalValue<number>;

    expect(responsive(stated, doubled)).toStrictEqual({ base: "2" });
  });

  it("transforms a nested breakpoint", () => {
    expect(responsive({ md: { base: 2 } }, doubled)).toStrictEqual({ md: { base: "4" } });
  });
});
