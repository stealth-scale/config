import { expect, test } from "vite-plus/test";

import { reachable } from "#server/reachable.ts";
import { answered } from "#vite.fixtures.ts";

test("answers to the names it was given, under the dev server's own key", async () => {
  const held = await answered(reachable(["app1.example.test"]));

  expect(held.server?.allowedHosts).toEqual(["app1.example.test"]);
});

test("leaves the preview alone, which keeps its own list", async () => {
  expect((await answered(reachable(["a.example.test"]))).preview).toBeUndefined();
});

test("is named the same whatever a machine arranged, so a repository can take it back", () => {
  expect(reachable(["a.example.test"]).name).toBe("server.reachable");
});
