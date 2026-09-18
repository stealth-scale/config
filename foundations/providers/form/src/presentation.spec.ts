import { describe, expect, expectTypeOf, it } from "vitest";

import { type Group, isGroup, type Member, type Presentation } from "#presentation.ts";

interface Checkout {
  billing: { city: string; line1: string };
  email: string;
  lines: Array<{ amount: number }>;
}

describe("Presentation", () => {
  it("checks every member against a typed form", () => {
    const presentation: Presentation<Checkout> = {
      fields: { "lines[].amount": { span: 2 } },
      id: "checkout",
      of: ["email", { legend: true, name: "billing", of: ["billing.line1", "billing.city"] }],
    };

    expectTypeOf<Member<Checkout>>().toEqualTypeOf<
      | "billing.city"
      | "billing.line1"
      | "billing"
      | "email"
      | "lines"
      | "lines[].amount"
      | "lines[]"
      | Group<Checkout>
    >();

    expect(presentation.of).toHaveLength(2);
  });

  it("admits any path for a form without a type", () => {
    const presentation: Presentation = { id: "manifest", of: ["whatever.the.manifest.says"] };

    expectTypeOf<Member>().toEqualTypeOf<Group | string>();

    expect(presentation.of).toStrictEqual(["whatever.the.manifest.says"]);
  });

  it("draws a repeat group once per item of an array path", () => {
    const lines: Group<Checkout> = { of: ["lines[].amount"], repeat: "lines" };

    expect(lines.repeat).toBe("lines");
  });
});

describe("isGroup", () => {
  it("returns true for a group", () => {
    expect(isGroup({ of: [] })).toBe(true);
  });

  it("returns false for a path", () => {
    expect(isGroup("email")).toBe(false);
  });
});
