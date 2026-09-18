import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, it } from "vitest";

import { Reports } from "#reports.tsx";

describe("Reports", () => {
  it("draws the dashboard with the count this page reports on", () => {
    expect(renderToStaticMarkup(<Reports />)).toContain("3 open");
  });

  it("takes no props because a route component is given none", () => {
    expect(renderToStaticMarkup(<Reports />)).toContain("panel");
  });
});
