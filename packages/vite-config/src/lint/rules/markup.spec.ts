/**
 * Specifies the markup and cookie APIs the browser tier turns away.
 */

import { describe, expect, it } from "vitest";

import { MARKUP } from "#lint/rules/markup.ts";

describe("markup", () => {
  it("names no framework", () => {
    for (const rule of Object.keys(MARKUP)) {
      expect(rule.startsWith("react/")).toBe(false);
      expect(rule.startsWith("jsx-a11y/")).toBe(false);
    }
  });

  it("refuses every way a string reaches the parser", () => {
    const [, ...properties] = MARKUP["no-restricted-properties"] as [
      string,
      ...Array<{ property: string }>,
    ];

    expect(properties.map((one) => one.property)).toStrictEqual([
      "innerHTML",
      "outerHTML",
      "insertAdjacentHTML",
      "cookie",
    ]);
  });

  it("gives a reason with every refusal", () => {
    const [, ...properties] = MARKUP["no-restricted-properties"] as [
      string,
      ...Array<{ message: string }>,
    ];

    for (const held of properties) {
      expect(held.message.length).toBeGreaterThan(0);
    }
  });

  it("refuses the cookie on the document rather than the word anywhere", () => {
    const [, ...properties] = MARKUP["no-restricted-properties"] as [
      string,
      ...Array<{ object?: string; property: string }>,
    ];
    const cookie = properties.find((one) => one.property === "cookie");

    expect(cookie?.object).toBe("document");
  });
});
