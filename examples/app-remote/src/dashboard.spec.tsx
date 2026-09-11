import { renderToStaticMarkup } from "react-dom/server";

import { expect, test } from "vite-plus/test";

import { Dashboard } from "#dashboard.tsx";

test("reports the count it was given", () => {
  expect(renderToStaticMarkup(<Dashboard count={3} />)).toContain("3 open");
});

test("draws inside the shared panel, which is what makes the two applications match", () => {
  expect(renderToStaticMarkup(<Dashboard count={0} />)).toContain("panel");
});
