import { expect, test } from "vite-plus/test";

import { page } from "#override.ts";
import { PAGE } from "#preset/page.ts";

test("takes the house layout back by name before putting another in its place", () => {
  const held = page("app");

  expect(held[0]?.kind).toBe("removal");
  expect(held[0]).toHaveProperty("target", `react/layout.page(${PAGE})`);
});

test("roots the package where the repository says, in the order the removal comes first", () => {
  const held = page("app");

  expect(held[1]?.name).toBe("layout.page(app)");
});

test("says which directory it moved to, so the reason reads without the code", () => {
  expect(page("app")[0]).toHaveProperty("because", expect.stringContaining("app"));
});
