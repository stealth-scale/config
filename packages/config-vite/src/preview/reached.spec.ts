import { expect, test } from "vite-plus/test";

import { reached } from "#preview/reached.ts";

test("states the port, the names and the address, which answer one question between them", () => {
  expect(reached(4401, ["a.example.test"]).map((one) => one.name)).toEqual([
    "preview.port(4401)",
    "preview.reachable",
    "preview.bound",
  ]);
});

test("keeps the dev server's own, so an app is previewed while it is served", () => {
  for (const held of reached(4401, ["a.example.test"])) {
    expect(held.name.startsWith("preview.")).toBe(true);
  }
});

test("states the port alone where no name is in play", () => {
  expect(reached(4401).map((one) => one.name)).toContain("preview.port(4401)");
});
