import { describe, expect, it } from "vitest";

import { rendered } from "#server.ts";

const PAGE = '<html><body><div id="root"><!--app--></div></body></html>';

describe("server", () => {
  it("renders the application into the slot the page left for it", () => {
    expect(rendered(PAGE, "totals")).toContain("panel");
  });

  it("leaves the rest of the page as the build wrote it", () => {
    expect(rendered(PAGE, "totals").startsWith("<html><body>")).toBe(true);
  });

  it("replaces the slot", () => {
    expect(rendered(PAGE, "totals")).not.toContain("<!--app-->");
  });

  it("reports the status it was given", () => {
    expect(rendered(PAGE, "arrears")).toContain("arrears");
  });
});
