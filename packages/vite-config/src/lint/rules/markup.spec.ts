import { expect, test } from "vite-plus/test";

import { MARKUP } from "#lint/rules/markup.ts";

test("names no framework, so this package never has to depend on one", () => {
  for (const rule of Object.keys(MARKUP)) {
    expect(rule.startsWith("react/")).toBe(false);
    expect(rule.startsWith("jsx-a11y/")).toBe(false);
  }
});

test("refuses every way a string reaches the parser", () => {
  const [, ...properties] = MARKUP["no-restricted-properties"] as [
    string,
    ...Array<{ property: string }>,
  ];

  expect(properties.map((one) => one.property)).toEqual([
    "innerHTML",
    "outerHTML",
    "insertAdjacentHTML",
    "cookie",
  ]);
});

test("says why, since a refusal an author cannot act on is one they route around", () => {
  const [, ...properties] = MARKUP["no-restricted-properties"] as [
    string,
    ...Array<{ message: string }>,
  ];

  for (const held of properties) {
    expect(held.message.length).toBeGreaterThan(0);
  }
});

test("refuses the cookie on the document rather than the word anywhere", () => {
  const [, ...properties] = MARKUP["no-restricted-properties"] as [
    string,
    ...Array<{ object?: string; property: string }>,
  ];
  const cookie = properties.find((one) => one.property === "cookie");

  expect(cookie?.object).toBe("document");
});
