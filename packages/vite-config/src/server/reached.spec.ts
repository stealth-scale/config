import { expect, test } from "vite-plus/test";

import { reached } from "#server/reached.ts";

test("states the port, the names and the address, which answer one question between them", () => {
  expect(reached(4400, ["a.example.test"]).map((one) => one.name)).toEqual([
    "server.port(4400)",
    "server.reachable",
    "server.bound",
  ]);
});

test("keeps each under its own name, so one of the three can be taken back", () => {
  for (const held of reached(4400, ["a.example.test"])) {
    expect(held.name.startsWith("server.")).toBe(true);
  }
});

test("states the port alone where no name is in play", () => {
  expect(reached(4400).map((one) => one.name)).toContain("server.port(4400)");
});
