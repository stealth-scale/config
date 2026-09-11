import { expect, test } from "vite-plus/test";

import { SORT } from "#lint/rules/sort.ts";

/**
 * The sorters left off on purpose, because each one reaches an order that carries meaning.
 */
const REFUSED = [
  "sort-arrays",
  "sort-classes",
  "sort-enums",
  "sort-maps",
  "sort-modules",
  "sort-sets",
  "sort-variable-declarations",
];

test("settles each sorter one way, so none is argued per file", () => {
  for (const [rule, severity] of Object.entries(SORT)) {
    expect(Array.isArray(severity), `${rule} carries no options`).toBe(true);
    expect((severity as unknown[])[0]).toBe("error");
  }
});

test("sorts nothing whose order is its data", () => {
  for (const rule of REFUSED) {
    expect(Object.keys(SORT)).not.toContain(`perfectionist/${rule}`);
  }
});

test("leaves import order to the formatter, which already sorts it on every save", () => {
  expect(Object.keys(SORT)).not.toContain("perfectionist/sort-imports");
});

test("keeps a deliberate grouping, except among members a docblock already separates", () => {
  const grouped = SORT["perfectionist/sort-objects"] as [string, { partitionByNewLine: boolean }];
  const throughout = SORT["perfectionist/sort-interfaces"] as [
    string,
    { partitionByNewLine: boolean },
  ];

  expect(grouped[1].partitionByNewLine).toBe(true);
  expect(throughout[1].partitionByNewLine).toBe(false);
});
