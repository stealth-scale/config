import { renderToStaticMarkup } from "react-dom/server";

import { expect, test } from "vite-plus/test";

import { Shell } from "#shell.tsx";

test("draws the host's own panel, which comes from the library both applications share", () => {
  expect(renderToStaticMarkup(<Shell>{null}</Shell>)).toContain("panel");
});

test("draws whatever it was handed in the hole it left for it", () => {
  expect(renderToStaticMarkup(<Shell>{"loaded"}</Shell>)).toContain("loaded");
});

test("names the hole, so the loaded application can be found on the page again", () => {
  expect(renderToStaticMarkup(<Shell>{null}</Shell>)).toContain('id="remote"');
});
