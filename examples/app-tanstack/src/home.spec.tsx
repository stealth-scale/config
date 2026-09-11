import { renderToStaticMarkup } from "react-dom/server";

import { expect, test } from "vite-plus/test";

import { Home } from "#home.tsx";

test("draws in the panel both applications share", () => {
  expect(renderToStaticMarkup(<Home />)).toContain("panel");
});

test("says which application owns the page", () => {
  expect(renderToStaticMarkup(<Home />)).toContain("owns this page");
});
