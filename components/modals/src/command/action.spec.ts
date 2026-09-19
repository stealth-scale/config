import { describe, expect, it } from "vitest";

import { type CommandAction, gathered, labelOf, valueOf } from "#command/action.ts";

/**
 * An action listed under a heading.
 */
const INVOICES: CommandAction = { group: "Go to", label: "Invoices", value: "invoices" };

/**
 * A second action under the same heading.
 */
const REPORTS: CommandAction = { group: "Go to", label: "Reports", value: "reports" };

/**
 * An action naming no heading.
 */
const NEW: CommandAction = { label: "New document", value: "new" };

describe("labelOf", () => {
  it("reads the words an action is listed by", () => {
    expect(labelOf(INVOICES)).toBe("Invoices");
  });
});

describe("valueOf", () => {
  it("reads the value an action is chosen by", () => {
    expect(valueOf(INVOICES)).toBe("invoices");
  });
});

describe("gathered", () => {
  it("returns one entry per heading", () => {
    expect(gathered([INVOICES, NEW, REPORTS]).map(([heading]) => heading)).toStrictEqual([
      "Go to",
      "",
    ]);
  });

  it("keeps every action under the heading it names", () => {
    expect(gathered([INVOICES, NEW, REPORTS])[0]?.[1].map(labelOf)).toStrictEqual([
      "Invoices",
      "Reports",
    ]);
  });

  it("gathers an action naming no heading under the empty string", () => {
    expect(gathered([INVOICES, NEW, REPORTS])[1]?.[1].map(labelOf)).toStrictEqual(["New document"]);
  });

  it("orders the headings by the first action that named each", () => {
    expect(gathered([NEW, INVOICES]).map(([heading]) => heading)).toStrictEqual(["", "Go to"]);
  });

  it("returns nothing where there are no actions", () => {
    expect(gathered([])).toStrictEqual([]);
  });
});
