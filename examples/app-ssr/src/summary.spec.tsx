import { renderToStaticMarkup } from "react-dom/server";

import { expect, test } from "vite-plus/test";

import { Summary } from "#summary.tsx";

test("reports the subject it was given", () => {
  expect(renderToStaticMarkup(<Summary subject="totals" />)).toContain("totals");
});

test("draws inside the shared panel, the same one the browser will draw over", () => {
  expect(renderToStaticMarkup(<Summary subject="totals" />)).toContain("panel");
});

test("reaches for nothing a server does not have", () => {
  expect(() => renderToStaticMarkup(<Summary subject="totals" />)).not.toThrow();
});
