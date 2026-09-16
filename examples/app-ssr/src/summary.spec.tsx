import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, test } from "vitest";

import { Summary } from "#summary.tsx";

describe("summary", () => {
  test("reports the subject it was given", () => {
    expect(renderToStaticMarkup(<Summary subject="totals" />)).toContain("totals");
  });

  test("draws inside the shared panel, the same one the browser will draw over", () => {
    expect(renderToStaticMarkup(<Summary subject="totals" />)).toContain("panel");
  });

  test("reaches for nothing a server does not have", () => {
    expect(() => renderToStaticMarkup(<Summary subject="totals" />)).not.toThrow();
  });
});
