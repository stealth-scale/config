import { renderToStaticMarkup } from "react-dom/server";

import { describe, expect, test } from "vitest";

import { Home } from "#home.tsx";

describe("home", () => {
  test("draws in the panel both applications share", () => {
    expect(renderToStaticMarkup(<Home />)).toContain("panel");
  });

  test("says which application owns the page", () => {
    expect(renderToStaticMarkup(<Home />)).toContain("owns this page");
  });
});
