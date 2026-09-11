import { renderToStaticMarkup } from "react-dom/server";

import { expect, test } from "vite-plus/test";

import { Shell } from "#shell.tsx";

test("draws the host's own panel, which comes from the library both applications share", () => {
  expect(renderToStaticMarkup(<Shell />)).toContain("panel");
});

test("leaves a hole for what it loads, named so the loaded application can be found again", () => {
  expect(renderToStaticMarkup(<Shell />)).toContain('id="remote"');
});
