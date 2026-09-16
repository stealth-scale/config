/**
 * Specifies what the sorters cover, how they partition, and what they skip.
 */

import { describe, expect, it } from "vitest";

import { SORT } from "#lint/rules/sort.ts";

const REFUSED = [
  "sort-arrays",
  "sort-classes",
  "sort-enums",
  "sort-maps",
  "sort-modules",
  "sort-sets",
  "sort-variable-declarations",
];

describe("sort", () => {
  it("configures each sorter one way", () => {
    for (const [rule, severity] of Object.entries(SORT)) {
      expect(Array.isArray(severity), `${rule} carries no options`).toBe(true);
      expect((severity as unknown[])[0]).toBe("error");
    }
  });

  it("sorts nothing whose order is its data", () => {
    for (const rule of REFUSED) {
      expect(Object.keys(SORT)).not.toContain(`perfectionist/${rule}`);
    }
  });

  it("leaves import order to the formatter", () => {
    expect(Object.keys(SORT)).not.toContain("perfectionist/sort-imports");
  });

  it("keeps a deliberate grouping except among members a docblock already separates", () => {
    const grouped = SORT["perfectionist/sort-objects"] as [string, { partitionByNewLine: boolean }];
    const throughout = SORT["perfectionist/sort-interfaces"] as [
      string,
      { partitionByNewLine: boolean },
    ];

    expect(grouped[1].partitionByNewLine).toBe(true);
    expect(throughout[1].partitionByNewLine).toBe(false);
  });
});
