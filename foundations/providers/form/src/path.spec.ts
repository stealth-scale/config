import { describe, expect, expectTypeOf, it } from "vitest";

import { collapse, type Path, segmentsOf } from "#path.ts";

interface Checkout {
  billing: { city: string; vat: string };
  due: Date;
  email: string;
  lines: Array<{ amount: number }>;
}

interface Deep {
  a: { b: { c: { d: { e: { f: string } } } } };
}

describe("Path", () => {
  it("names every member and every nested member of a typed form", () => {
    expectTypeOf<Path<Checkout>>().toEqualTypeOf<
      | "billing.city"
      | "billing.vat"
      | "billing"
      | "due"
      | "email"
      | "lines"
      | "lines[].amount"
      | "lines[]"
    >();

    expect(collapse("email")).toBe("email");
  });

  it("admits any string for a form without a type", () => {
    expectTypeOf<Path<unknown>>().toEqualTypeOf<string>();
    expectTypeOf<Path<Record<string, string>>>().toEqualTypeOf<string>();

    expect(collapse("anything")).toBe("anything");
  });

  it("stops five levels deep", () => {
    expectTypeOf<Path<Deep>>().toEqualTypeOf<"a.b.c.d.e" | "a.b.c.d" | "a.b.c" | "a.b" | "a">();

    expect(collapse("a.b.c.d.e")).toBe("a.b.c.d.e");
  });

  it("collapses every index in a path", () => {
    expect(collapse("lines[0].amount")).toBe("lines[].amount");
    expect(collapse("lines[12].parts[3].name")).toBe("lines[].parts[].name");
  });
});

describe("segmentsOf", () => {
  it.each([
    { pointer: "#", want: [] },
    { pointer: "#/name", want: ["name"] },
    { pointer: "/billing/city", want: ["billing", "city"] },
    { pointer: "#/lines/0/amount", want: ["lines", 0, "amount"] },
    { pointer: "#/a~1b/c~0d", want: ["a/b", "c~d"] },
  ])("splits the pointer $pointer into $want", ({ pointer, want }) => {
    expect(segmentsOf(pointer)).toStrictEqual(want);
  });
});
