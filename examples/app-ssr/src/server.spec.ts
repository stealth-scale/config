import { expect, test } from "vite-plus/test";

import { rendered } from "#server.ts";

/**
 * A page of the shape a build produces, holding the slot and nothing else of interest.
 */
const PAGE = '<html><body><div id="root"><!--app--></div></body></html>';

test("draws the application into the slot the page left for it", () => {
  expect(rendered(PAGE, "totals")).toContain("panel");
});

test("leaves the rest of the page as the build wrote it", () => {
  expect(rendered(PAGE, "totals").startsWith("<html><body>")).toBe(true);
});

test("replaces the slot, so nothing is drawn twice when the browser takes over", () => {
  expect(rendered(PAGE, "totals")).not.toContain("<!--app-->");
});

test("reports whatever it was asked to", () => {
  expect(rendered(PAGE, "arrears")).toContain("arrears");
});
